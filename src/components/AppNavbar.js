import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Form, InputGroup, Dropdown, Badge, Button, Offcanvas } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaSearch, FaHome, FaTachometerAlt, FaBars, FaTimes } from "react-icons/fa";
import UserContext from "../context/UserContext";

export default function AppNavbar() {
    const { user } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();

    const fetchCartData = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/get-cart`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            
            if (data.cart?.cartItems?.length > 0) {
                const cartItemsWithImages = await Promise.all(
                    data.cart.cartItems.map(async (item) => {
                        try {
                            const productRes = await fetch(`${process.env.REACT_APP_API_URL}/products/${item.productId}`);
                            const productData = await productRes.json();
                            return {
                                ...item,
                                imageUrl: productData.imageUrl || '',
                                productName: productData.name || item.productName,
                                price: productData.price || item.price
                            };
                        } catch (error) {
                            return { ...item, imageUrl: '' };
                        }
                    })
                );
                setCartItems(cartItemsWithImages);
                setCartTotal(data.cart.totalPrice);
            } else {
                setCartItems([]);
                setCartTotal(0);
            }
        } catch (error) {
            console.error('Cart fetch error:', error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchCartData();
            
            const handleCartUpdate = () => {
                fetchCartData();
            };
            
            window.addEventListener('cartUpdated', handleCartUpdate);
            
            return () => {
                window.removeEventListener('cartUpdated', handleCartUpdate);
            };
        }
    }, [user]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
            setShowMobileMenu(false);
        }
    };

    const formatPrice = (price) => {
        return `₱${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const handleNavLinkClick = () => {
        setShowMobileMenu(false);
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl || imageUrl === '' || imageUrl === 'undefined' || imageUrl === 'null') {
            return "https://via.placeholder.com/50x50?text=No+Image";
        }
        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('/')) return `${process.env.REACT_APP_API_URL}${imageUrl}`;
        return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
    };

    const CartDropdown = () => (
        <Dropdown.Menu 
            className="p-0 cart-dropdown" 
            style={{ 
                minWidth: '380px',
                position: 'absolute',
                right: 0,
                left: 'auto',
                zIndex: 9999
            }}
        >
            <Dropdown.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Shopping Cart</span>
                    <Badge bg="primary">{cartItems.length} items</Badge>
                </div>
            </Dropdown.Header>
            {cartItems.length === 0 ? (
                <Dropdown.ItemText className="text-center py-3 text-muted">
                    Your cart is empty
                </Dropdown.ItemText>
            ) : (
                <>
                    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {cartItems.slice(0, 4).map((item) => (
                            <Dropdown.Item 
                                key={item.productId}
                                as="div"
                                className="d-flex align-items-center py-2 border-bottom"
                                style={{ cursor: 'default' }}
                            >
                                <div className="flex-shrink-0 me-3">
                                    <img
                                        src={getImageUrl(item.imageUrl)}
                                        alt={item.productName}
                                        className="rounded"
                                        style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            objectFit: 'cover',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                        onError={e => e.target.src = "https://via.placeholder.com/50x50?text=No+Image"}
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="fw-semibold small product-name-full" style={{ 
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: '1.2',
                                        maxWidth: '180px'
                                    }}>
                                        {item.productName}
                                    </div>
                                    <div className="text-muted small">
                                        {item.quantity} × {formatPrice(item.price)}
                                    </div>
                                </div>
                                <div className="text-primary fw-bold ms-2">
                                    {formatPrice(item.subtotal)}
                                </div>
                            </Dropdown.Item>
                        ))}
                        {cartItems.length > 4 && (
                            <Dropdown.ItemText className="text-center text-muted small py-2">
                                +{cartItems.length - 4} more items
                            </Dropdown.ItemText>
                        )}
                    </div>
                    <div className="p-3 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">Total:</span>
                            <span className="fw-bold text-success">{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="d-grid">
                            <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => navigate('/cart')}
                            >
                                VIEW CART
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Dropdown.Menu>
    );

    return (
        <>
            <Navbar expand="lg" variant="dark" className="fixed-top" style={{ backgroundColor: "#001f3f" }}>
                <Container fluid>
                    <div className="d-flex align-items-center w-100">
                        <Button
                            variant="outline-light"
                            className="d-lg-none me-2 border-0 bg-transparent"
                            onClick={() => setShowMobileMenu(true)}
                        >
                            <FaBars size={20} />
                        </Button>

                        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center me-4 ms-1"> 
                            <img
                                 src="/images/Zuittlogo.png"
                                 alt="Zuittech logo"
                                 className="img-fluid"
                                 style={{ width: "60px", height: "auto" }}
                            />
                        </Navbar.Brand>

                        <Form className="d-none d-md-flex ms-5 me-3 flex-grow-1" onSubmit={handleSearch}> 
                            <InputGroup className="rounded-pill overflow-hidden" style={{ maxWidth: '500px' }}> 
                                <Form.Control
                                    type="search"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border-0 ps-3"
                                />
                                <InputGroup.Text 
                                    as="button" 
                                    type="submit" 
                                    className="border-0 text-light"
                                    style={{ backgroundColor: '#003366' }}
                                >
                                    <FaSearch />
                                </InputGroup.Text>
                            </InputGroup>
                        </Form>

                        {user.id && !user.isAdmin && (
                            <div className="d-lg-none d-flex align-items-center ms-auto">
                                <Nav.Link as={NavLink} to="/profile" className="d-flex align-items-center me-3 text-light">
                                    <FaUser size={18} />
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/cart" className="d-flex align-items-center position-relative text-light me-3">
                                    <FaShoppingCart size={18} />
                                    {cartItems.length > 0 && (
                                        <Badge 
                                            bg="danger" 
                                            className="position-absolute top-0 start-100 translate-middle"
                                            style={{ fontSize: '0.6rem' }}
                                        >
                                            {cartItems.length}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </div>
                        )}
                    </div>

                    <Navbar.Collapse id="main-navbar">
                        <Nav className="ms-auto d-flex align-items-center">
                            {user.id === null ? (
                                <>
                                    <Nav.Link as={NavLink} to="/login" className="d-flex align-items-center">
                                        <FaUser className="me-1" />
                                    </Nav.Link>
                                    <Nav.Link as={NavLink} to="/cart" className="d-flex align-items-center">
                                        <FaShoppingCart className="me-1" />
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    {!user.isAdmin ? (
                                        <>
                                            <div className="d-none d-md-flex align-items-center">
                                                <Nav.Link as={NavLink} to="/profile" className="d-flex align-items-center">
                                                    <FaUser/>
                                                </Nav.Link>
                                                
                                                <Dropdown align="end" className="position-relative">
                                                    <Dropdown.Toggle 
                                                        as={Nav.Link} 
                                                        className="position-relative d-flex align-items-center bg-none border-0"
                                                    >
                                                        <FaShoppingCart className="me-1" />
                                                        {cartItems.length > 0 && (
                                                            <Badge 
                                                                bg="danger" 
                                                                className="position-absolute top-0 start-100 translate-middle"
                                                                style={{ fontSize: '0.6rem' }}
                                                            >
                                                                {cartItems.length}
                                                            </Badge>
                                                        )}
                                                    </Dropdown.Toggle>
                                                    <CartDropdown />
                                                </Dropdown>
                                            </div>
                                        </>
                                    ) : (
                                        <Nav.Link as={NavLink} to="/products" className="d-flex align-items-center">
                                            <FaTachometerAlt className="me-1" />
                                            <span className="d-none d-sm-inline">Dashboard</span>
                                        </Nav.Link>
                                    )}
                                    
                                    <Nav.Link as={Link} to="/logout" className="d-flex align-items-center ms-2">
                                        <span className="d-none d-sm-inline">Logout</span>
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {!user.isAdmin && (
                <Navbar 
                    expand="lg" 
                    variant="light" 
                    bg="light" 
                    className="fixed-top border-bottom d-none d-lg-block"
                    style={{ top: '56px', zIndex: 1029 }}
                >
                    <Container fluid>
                        <Navbar.Collapse id="secondary-navbar">
                            <Nav className="me-auto">
                                <Nav.Link as={NavLink} to="/"><FaHome className="me-1" /> Home</Nav.Link>
                                <Nav.Link as={NavLink} to="/new-arrivals">New Arrivals</Nav.Link>
                                <Nav.Link as={NavLink} to="/products">All Products</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Smartphones & Tablets">Smartphones & Tablets</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Laptops & Computers">Laptops & Computers</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Gaming">Gaming</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Audio">Audio</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Accessories">Accessories</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}

            <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="start">
                <Offcanvas.Header className="text-white border-bottom border-secondary" style={{ backgroundColor: '#003366' }}>
                    <div className="d-flex align-items-center w-100">
                        <div className="d-flex align-items-center flex-grow-1">
                            <img 
                                src="/images/Zuittlogo.png" 
                                alt="Zuittech logo" 
                                style={{ width: "60px", height: "auto", marginRight: "15px" }} 
                            />
                            <Form onSubmit={handleSearch} className="flex-grow-1">
                                <InputGroup style={{ maxWidth: '200px' }}>
                                    <Form.Control 
                                        type="search" 
                                        placeholder="Search..." 
                                        value={searchQuery} 
                                        onChange={(e) => setSearchQuery(e.target.value)} 
                                        className="border-end-0"
                                        size="sm"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSearch(e);
                                            }
                                        }}
                                    />
                                    <InputGroup.Text 
                                        as="button" 
                                        type="submit" 
                                        className="text-light border-start-0"
                                        style={{ backgroundColor: '#001f3f' }}
                                        onClick={handleSearch}
                                    >
                                        <FaSearch size={14} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form>
                        </div>
                        
                        <Button 
                            variant="link" 
                            className="text-white p-1 bg-transparent border-0 ms-2" 
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <FaTimes size={20} />
                        </Button>
                    </div>
                </Offcanvas.Header>
                
                <Offcanvas.Body className="p-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <Nav className="flex-column">
                        <Nav.Link as={NavLink} to="/" onClick={handleNavLinkClick} className="d-flex align-items-center py-3 border-bottom">
                            <FaHome className="me-3" /> Home
                        </Nav.Link>
                        
                        {user.isAdmin ? (
                            <>
                                <Nav.Link as={NavLink} to="/products" onClick={handleNavLinkClick} className="d-flex align-items-center py-3 border-bottom">
                                    <FaTachometerAlt className="me-3" /> Dashboard
                                </Nav.Link>
                                <Nav.Link as={Link} to="/logout" onClick={handleNavLinkClick} className="d-flex align-items-center py-3 text-danger">
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/new-arrivals" onClick={handleNavLinkClick} className="d-flex align-items-center py-3 border-bottom">New Arrivals</Nav.Link>
                                <Nav.Link as={NavLink} to="/products" onClick={handleNavLinkClick} className="d-flex align-items-center py-3 border-bottom">All Products</Nav.Link>
                                <div className="ps-3 py-2 border-bottom"><small className="text-muted fw-bold">CATEGORIES</small></div>
                                <Nav.Link as={NavLink} to="/products/category/Smartphones & Tablets" onClick={handleNavLinkClick} className="d-flex align-items-center py-2 ps-4">Smartphones & Tablets</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Laptops & Computers" onClick={handleNavLinkClick} className="d-flex align-items-center py-2 ps-4">Laptops & Computers</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Gaming" onClick={handleNavLinkClick} className="d-flex align-items-center py-2 ps-4">Gaming</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Audio" onClick={handleNavLinkClick} className="d-flex align-items-center py-2 ps-4">Audio</Nav.Link>
                                <Nav.Link as={NavLink} to="/products/category/Accessories" onClick={handleNavLinkClick} className="d-flex align-items-center py-2 ps-4 border-bottom">Accessories</Nav.Link>
                                
                                <div className="ps-3 py-2 border-bottom mt-2"><small className="text-muted fw-bold">ACCOUNT</small></div>
                                {user.id === null ? (
                                    <>
                                        <Nav.Link as={NavLink} to="/login" onClick={handleNavLinkClick} className="d-flex align-items-center py-3"><FaUser className="me-3" />Login</Nav.Link>
                                        <Nav.Link as={NavLink} to="/cart" onClick={handleNavLinkClick} className="d-flex align-items-center py-3"><FaShoppingCart className="me-3" />Cart</Nav.Link>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link as={NavLink} to="/profile" onClick={handleNavLinkClick} className="d-flex align-items-center py-3"><FaUser className="me-3" />Profile</Nav.Link>
                                        <Nav.Link as={NavLink} to="/cart" onClick={handleNavLinkClick} className="d-flex align-items-center py-3 position-relative">
                                            <FaShoppingCart className="me-3" />My Cart
                                            {cartItems.length > 0 && <Badge bg="danger" className="ms-2">{cartItems.length}</Badge>}
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/logout" onClick={handleNavLinkClick} className="d-flex align-items-center py-3 text-danger">
                                            Logout
                                        </Nav.Link>
                                    </>
                                )}
                            </>
                        )}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}