import { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Table, Spinner } from "react-bootstrap";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCreditCard } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function CartView() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const notyf = new Notyf();

    useEffect(() => {
        if (user?.id) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/get-cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.cart) {
                setCart(data.cart);
                const itemsWithImages = await Promise.all(
                    data.cart.cartItems.map(async (item) => {
                        try {
                            const productRes = await fetch(`${process.env.REACT_APP_API_URL}/products/${item.productId}`);
                            const productData = await productRes.json();
                            return {
                                ...item,
                                imageUrl: productData.imageUrl || '',
                                productName: productData.name || item.productName
                            };
                        } catch (error) {
                            return { ...item, imageUrl: '' };
                        }
                    })
                );
                setCartItems(itemsWithImages);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/update-cart-quantity`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId: productId,
                    quantity: newQuantity
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                window.dispatchEvent(new Event('cartUpdated'));
                fetchCart(); 
            } else {
                notyf.error(data.error || 'Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            notyf.error('Failed to update quantity');
        }
    };

    const removeFromCart = async (productId) => {
        const confirmed = window.confirm('Are you sure you want to remove this item from your cart?');
        
        if (confirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/remove-from-cart`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                
                if (response.ok) {
                    window.dispatchEvent(new Event('cartUpdated'));
                    notyf.success('Item has been removed from your cart.');
                    fetchCart(); 
                } else {
                    notyf.error(data.error || 'Failed to remove item');
                }
            } catch (error) {
                console.error('Error removing item:', error);
                notyf.error('Failed to remove item');
            }
        }
    };

    const clearCart = async () => {
        if (cartItems.length === 0) return;

        const confirmed = window.confirm('Are you sure you want to remove all items from your cart?');
        
        if (confirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/clear-cart`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                
                if (response.ok) {
                    window.dispatchEvent(new Event('cartUpdated'));
                    notyf.success('Your cart has been cleared.');
                    fetchCart(); 
                } else {
                    notyf.error(data.error || 'Failed to clear cart');
                }
            } catch (error) {
                console.error('Error clearing cart:', error);
                notyf.error('Failed to clear cart');
            }
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            notyf.error('Your cart is empty. Add some items before checkout.');
            return;
        }

        const confirmed = window.confirm(
            `Proceed to Checkout?\n\nTotal amount: ₱${cart?.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        );

        if (confirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                
                if (response.ok) {
                    window.dispatchEvent(new Event('cartUpdated'));
                    notyf.success('Your order has been placed successfully!');
                    setTimeout(() => {
                        navigate('/orders'); 
                    }, 1500);
                } else {
                    notyf.error(data.error || 'Checkout failed');
                }
            } catch (error) {
                console.error('Error during checkout:', error);
                notyf.error('Checkout failed. Please try again.');
            }
        }
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl || imageUrl === '' || imageUrl === 'undefined' || imageUrl === 'null') {
            return "https://via.placeholder.com/80x80?text=No+Image";
        }
        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('/')) return `${process.env.REACT_APP_API_URL}${imageUrl}`;
        return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
    };

    const formatPrice = (price) => {
        return `₱${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (loading) {
        return (
            <div className="content-with-secondary-navbar">
                <Container className="py-5">
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading your cart...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (!user.id) {
        return (
            <div className="content-with-secondary-navbar">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <Card className="text-center">
                                <Card.Body className="py-5">
                                    <FaShoppingBag size={48} className="text-muted mb-3" />
                                    <h3>Please Log In</h3>
                                    <p className="text-muted mb-4">You need to be logged in to view your shopping cart.</p>
                                    <Button as={Link} to="/login" variant="primary" className="me-2">
                                        Login
                                    </Button>
                                    <Button as={Link} to="/register" variant="outline-primary">
                                        Register
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div className="content-with-secondary-navbar">
            <Container className="py-4 mb-5"> 
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                            <div className="mb-3 mb-md-0">
                                {cartItems.length > 0 && (
                                    <Button 
                                        variant="outline-secondary" 
                                        as={Link} 
                                        to="/products" 
                                        className="mb-2"
                                    >
                                        <FaArrowLeft className="me-2" />
                                        Continue Shopping
                                    </Button>
                                )}
                                <h1 className="h2 mb-1">My Shopping Cart</h1>
                                <p className="text-muted">Review and manage your items</p>
                            </div>
                            {cartItems.length > 0 && (
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={clearCart}
                                >
                                    <FaTrash className="me-1" />
                                  Clear Cart
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                {cartItems.length === 0 ? (
                    <Row>
                        <Col>
                            <Card className="text-center py-5 mb-5"> 
                                <Card.Body>
                                    <FaShoppingBag size={64} className="text-muted mb-3" />
                                    <h3>Your cart is empty</h3>
                                    <p className="text-muted mb-4">
                                        Looks like you haven't added any items to your cart yet.
                                    </p>
                                    <Button as={Link} to="/products" variant="primary" size="lg">
                                        Start Shopping
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <Col lg={8}>
                            <Card className="mb-4">
                                <Card.Body className="p-0">
                                    <Table responsive className="mb-0 d-none d-md-table">
                                        <thead className="bg-light">
                                            <tr>
                                                <th width="50%">Product</th>
                                                <th width="17%" className="text-center">Price</th>
                                                <th width="23%" className="text-center">Quantity</th>
                                                <th width="10%" className="text-center">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item) => (
                                                <tr key={item.productId} className="align-middle">
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={getImageUrl(item.imageUrl)}
                                                                alt={item.productName}
                                                                className="rounded me-3"
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    objectFit: 'cover'
                                                                }}
                                                                onError={e => e.target.src = "https://via.placeholder.com/60x60?text=No+Image"}
                                                            />
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-0 product-name-full" style={{ lineHeight: '1.3' }}>
                                                                    {item.productName}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="fw-semibold">{formatPrice(item.price)}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center quantity-control">
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <FaMinus size={12} />
                                                            </Button>
                                                            <Form.Control
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                                                className="mx-2 text-center"
                                                                style={{ width: '60px' }}
                                                                min="1"
                                                            />
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            >
                                                                <FaPlus size={12} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <span className="fw-bold text-primary me-2">
                                                                {formatPrice(item.subtotal)}
                                                            </span>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => removeFromCart(item.productId)}
                                                            >
                                                                <FaTrash size={12} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    <div className="d-md-none">
                                        {cartItems.map((item) => (
                                            <div key={item.productId} className="border-bottom p-3">
                                                <div className="d-flex align-items-start mb-3">
                                                    <img
                                                        src={getImageUrl(item.imageUrl)}
                                                        alt={item.productName}
                                                        className="rounded me-3"
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover'
                                                        }}
                                                        onError={e => e.target.src = "https://via.placeholder.com/60x60?text=No+Image"}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1" style={{ lineHeight: '1.3' }}>
                                                            {item.productName}
                                                        </h6>
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <span className="fw-semibold text-primary">{formatPrice(item.price)}</span>
                                                            <span className="fw-bold">{formatPrice(item.subtotal)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center quantity-control">
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <FaMinus size={12} />
                                                        </Button>
                                                        <Form.Control
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                                            className="mx-2 text-center"
                                                            style={{ width: '60px' }}
                                                            min="1"
                                                        />
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        >
                                                            <FaPlus size={12} />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item.productId)}
                                                    >
                                                        <FaTrash size={12} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="sticky-top mb-5" style={{ top: '100px' }}> {/* ✅ Added mb-5 */}
                                <Card.Header className="bg-light">
                                    <h5 className="mb-0">Order Summary</h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-3">
                                        <strong className="h5">Total:</strong>
                                        <strong className="h4 text-success">
                                            {formatPrice(cart?.totalPrice)}
                                        </strong>
                                    </div>
                                    
                                    <Button 
                                        variant="success" 
                                        size="lg" 
                                        className="w-100 mb-2"
                                        onClick={handleCheckout}
                                    >
                                        <FaCreditCard className="me-2" />
                                        Proceed to Checkout
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                <div className="mb-5"></div>
            </Container>
        </div>
    );
}