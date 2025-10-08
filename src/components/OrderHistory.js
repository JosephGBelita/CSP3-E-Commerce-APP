import { useState, useEffect, useContext, useMemo } from 'react';
import { Card, Row, Col, Container, Spinner, Badge, Button } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function OrderHistory() {
    const { user } = useContext(UserContext);
    const notyf = useMemo(() => new Notyf(), []);

    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) {
                notyf.error('You need to be logged in to view order history.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/my-orders`, {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    },
                });

                const data = await response.json();
                setOrders(data.orders || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
                notyf.error('Failed to load order history');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, notyf]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrders((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const getProductName = (item) => item.productId?.name || 'Product';

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Completed': 
                return 'success';
            case 'Cancelled': 
                return 'danger';
            default: 
                return 'warning';
        }
    };

    if (loading) {
        return (
            <Container className="text-center py-5" style={{ marginTop: '130px' }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading order history...</p>
            </Container>
        );
    }

    if (!orders.length) {
        return (
            <Container className="text-center py-5" style={{ 
                marginTop: '130px', 
                minHeight: 'calc(100vh - 180px)' 
            }}>
                <div className="py-5">
                    <div className="mb-4">
                        <i className="fas fa-shopping-bag fa-4x text-muted mb-3"></i>
                    </div>
                    <h4 className="fw-bold text-dark mb-3">No Orders Yet</h4>
                    <p className="text-muted mb-4">
                        Start your shopping journey and your orders will appear here.
                    </p>
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => window.location.href = '/products'}
                        className="px-4"
                    >
                        Start Shopping
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="px-3 px-md-4" style={{ 
            marginTop: '130px', 
            paddingTop: '20px',
            minHeight: 'calc(100vh - 180px)'
        }}>
            
            <div className="text-center mb-4 mb-md-5">
                <h1 className="fw-bold text-dark h3 h-md-2 mb-2">Order History</h1>
                <p className="text-muted mb-0">Your recent purchases and orders</p>
            </div>

            {orders.map((order) => (
                <Card key={order._id} className="mb-4 border-0 shadow-sm">
                    
                    <Card.Header 
                        className="bg-dark text-white cursor-pointer"
                        onClick={() => toggleOrderDetails(order._id)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && toggleOrderDetails(order._id)}
                    >
                        <Row className="align-items-center">
                            <Col xs={12} md={8}>
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center mb-1">
                                        <strong className="me-2">
                                            Order #{order._id.slice(-6).toUpperCase()}
                                        </strong>
                                        <Badge bg={getStatusVariant(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <small className="text-light">
                                        Purchased on: {formatDate(order.orderedOn)}
                                    </small>
                                </div>
                            </Col>
                            <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                                <small className="text-light opacity-75">
                                    {expandedOrders.includes(order._id) ? 'Hide Details' : 'Show Details'}
                                </small>
                            </Col>
                        </Row>
                    </Card.Header>

                    {expandedOrders.includes(order._id) && (
                        <Card.Body className="p-3 p-md-4">
                            
                            <h6 className="fw-bold mb-3 text-dark">Ordered Items</h6>
                            <div className="mb-4">
                                <ul className="list-unstyled mb-0">
                                    {order.productsOrdered.map((item, index) => (
                                        <li 
                                            key={index} 
                                            className="mb-2 d-flex justify-content-between align-items-center"
                                        >
                                            <span className="small">
                                                • {getProductName(item)}
                                            </span>
                                            <span className="text-muted small">
                                                Quantity: {item.quantity}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                                <strong className="text-dark">Total Amount:</strong>
                                <span className="text-success fw-bold fs-5">
                                    ₱{order.totalPrice.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>

                        </Card.Body>
                    )}
                </Card>
            ))}
        </Container>
    );
}