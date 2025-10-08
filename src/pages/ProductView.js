import { useState, useEffect, useContext, useMemo } from 'react';
import { Container, Button, InputGroup, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import { FaShoppingCart, FaArrowLeft, FaTag, FaInfoCircle, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'notyf/notyf.min.css';
import EditProduct from '../components/EditProduct';

export default function ProductView() {
    const notyf = useMemo(() => new Notyf(), []);
    const { productId } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState({ 
        name: "", description: "", price: 0, imageUrl: "", category: "", isActive: true 
    });
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const isAdmin = user?.isAdmin;

    const topMargin = user?.isAdmin ? '80px' : '120px';

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`);
                const data = await res.json();
                if (data) setProduct(data);
                else notyf.error('Product details not found!');
            } catch (err) {
                console.error('Fetch error:', err);
                notyf.error('Failed to fetch product details!');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId, notyf]);

    const handleQuantityChange = (value) => {
        const qty = Number(value);
        if (!isNaN(qty) && qty > 0) setQuantity(qty);
    };

    const addToCart = async () => {
        if (!user?.id) {
            notyf.error('You need to log in to add items to your cart.');
            navigate('/login');
            return;
        }

        if (user.isAdmin) {
            notyf.error('Admin cannot add items to cart');
            return;
        }

        setIsAddingToCart(true);
        
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ cartItems: [{ productId, quantity }] })
            });
            const data = await res.json();
            if (data.success) {
                window.dispatchEvent(new Event('cartUpdated'));
                notyf.success(data.message || 'Product added to cart!');
                
                setTimeout(() => {
                    navigate('/cart');
                }, 1000);
                
            } else {
                notyf.error(data.message || 'Failed to add to cart');
            }
        } catch (err) {
            console.error('Add to cart error:', err);
            notyf.error('An error occurred while adding to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const formatPrice = (price) => `₱${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return "https://via.placeholder.com/400x300?text=No+Image";
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${process.env.REACT_APP_API_URL}${imageUrl}`;
    };

    const archiveProduct = async () => {
        try {
            const endpoint = product.isActive ? 'archive' : 'activate';
            const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.success || data.message) {
                setProduct(prev => ({ ...prev, isActive: !prev.isActive }));
                notyf.success(`Product ${product.isActive ? 'archived' : 'activated'} successfully`);
            } else {
                notyf.error(data.error || 'Failed to update product status');
            }
        } catch (err) {
            console.error('Toggle status error:', err);
            notyf.error('An error occurred while updating product status');
        }
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ marginTop: topMargin }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading product details...</p>
                </div>
            </Container>
        );
    }

    if (!product.isActive && !isAdmin) {
        return (
            <Container className="mt-5" style={{ marginTop: topMargin }}>
                <Alert variant="warning" className="text-center">
                    <h4>Product Not Available</h4>
                    <p>This product is currently unavailable.</p>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                        <FaArrowLeft className="me-2" />Back to Products
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5" style={{ marginTop: topMargin }}>
            <Button variant="outline-secondary" onClick={() => navigate('/products')} className="mb-4">
                <FaArrowLeft className="me-2" />Back to Products
            </Button>

            <Row className="g-4">
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4 text-center">
                            <img
                                src={getImageUrl(product.imageUrl)}
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                                onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <h1 className="fw-bold text-dark mb-3">{product.name}</h1>

                            {product.category && (
                                <div className="d-flex align-items-center mb-3">
                                    <FaTag className="text-muted me-2" />
                                    <span className="text-muted">{product.category}</span>
                                </div>
                            )}

                            <div className="mb-4">
                                <h2 className="text-dark fw-bold mb-2">{formatPrice(product.price)}</h2>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-semibold mb-3">
                                    <FaInfoCircle className="me-2 text-primary" />Product Description
                                </h5>
                                <p className="text-muted lead" style={{ lineHeight: '1.6' }}>{product.description}</p>
                            </div>

                            {!isAdmin && product.isActive && (
                                <>
                                    <div className="mb-4">
                                        <h6 className="fw-semibold mb-3">Quantity</h6>
                                        <InputGroup className="mb-3" style={{ maxWidth: '200px' }}>
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            >
                                                -
                                            </Button>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={e => handleQuantityChange(e.target.value)}
                                                className="text-center"
                                            />
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => setQuantity(quantity + 1)}
                                            >
                                                +
                                            </Button>
                                        </InputGroup>
                                    </div>
                                    
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="w-100 py-3 fw-bold" 
                                        onClick={addToCart}
                                        disabled={isAddingToCart}
                                    >
                                        <FaShoppingCart className="me-2" />
                                        {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                                    </Button>
                                </>
                            )}

                            {isAdmin && (
                                <div className="mt-4 pt-3 border-top">
                                    <div className="d-grid gap-2">
                                        <div className="d-none">
                                            <EditProduct 
                                                product={product} 
                                                fetchData={() => {
                                                    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
                                                        .then(res => res.json())
                                                        .then(data => setProduct(data));
                                                }}
                                            />
                                        </div>
                                        
                                        <Button 
                                            variant="outline-primary"
                                            onClick={() => {
                                                document.querySelector('.edit-product-button')?.click();
                                            }}
                                        >
                                            <FaEdit className="me-2" />
                                            Edit Product
                                        </Button>
                                        
                                        <Button 
                                            variant={product.isActive ? "outline-warning" : "outline-success"}
                                            onClick={archiveProduct}
                                        >
                                            {product.isActive ? <FaEyeSlash className="me-2" /> : <FaEye className="me-2" />}
                                            {product.isActive ? 'Archive Product' : 'Activate Product'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}