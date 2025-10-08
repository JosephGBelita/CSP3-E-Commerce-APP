import { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Button, Container, Badge } from 'react-bootstrap';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import AddProduct from '../pages/AddProduct';
import AdminUserManagement from './AdminUserManagement';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminView({ productsData, fetchData }) {
    const notyf = useMemo(() => new Notyf(), []);
    const [showOrders, setShowOrders] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [expandedUsers, setExpandedUsers] = useState({});
    const [groupedOrders, setGroupedOrders] = useState({});

    const toggleOrdersView = () => setShowOrders(!showOrders);

    const toggleUserOrders = (userId) => {
        setExpandedUsers(prev => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    const productCards = productsData.map((product) => (
        <Card key={product._id} className="mb-3 shadow-sm">
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={3} className="text-center">
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" 
                             style={{ width: '80px', height: '80px' }}>
                            <img
                                src={
                                    product.imageUrl
                                        ? `${process.env.REACT_APP_API_URL}${product.imageUrl}`
                                        : product.image
                                        ? `${process.env.REACT_APP_API_URL}${product.image}`
                                        : 'https://via.placeholder.com/80x80?text=No+Img'
                                }
                                alt={product.name}
                                className="img-fluid"
                                style={{ 
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain' 
                                }}
                                onError={(e) => { 
                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Img'; 
                                }}
                            />
                        </div>
                    </Col>
                    
                    <Col xs={9}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="fw-bold mb-1 text-truncate">{product.name}</h6>
                            <Badge 
                                bg={product.isActive ? "success" : "danger"} 
                                className="ms-2"
                            >
                                {product.isActive ? 'Available' : 'Unavailable'}
                            </Badge>
                        </div>
                        
                        <p className="text-muted small mb-2 line-clamp-2">
                            {product.description}
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-primary">
                                ₱{product.price.toLocaleString()}
                            </span>
                            <div className="d-flex gap-1">
                                <EditProduct product={product} fetchData={fetchData} />
                                <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    ));

    const productTableRows = productsData.map((product) => (
        <tr key={product._id}>
            <td className="text-center">
                <div className="bg-light rounded d-flex align-items-center justify-content-center mx-auto" 
                     style={{ width: '50px', height: '50px' }}>
                    <img
                        src={
                            product.imageUrl
                                ? `${process.env.REACT_APP_API_URL}${product.imageUrl}`
                                : product.image
                                ? `${process.env.REACT_APP_API_URL}${product.image}`
                                : 'https://via.placeholder.com/50x50?text=No+Img'
                        }
                        alt={product.name}
                        width={50}
                        height={50}
                        style={{ 
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '4px'
                        }}
                        onError={(e) => { 
                            e.target.src = 'https://via.placeholder.com/50x50?text=No+Img'; 
                        }}
                    />
                </div>
            </td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>₱{product.price.toLocaleString()}</td>
            <td className={product.isActive ? 'text-success' : 'text-danger'}>
                {product.isActive ? 'Available' : 'Unavailable'}
            </td>
            <td className="text-center">
                <div className="d-flex flex-wrap justify-content-center gap-2">
                    <EditProduct product={product} fetchData={fetchData} />
                    <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} />
                </div>
            </td>
        </tr>
    ));

    useEffect(() => {
        if (!showOrders) return;

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch orders');
                const data = await res.json();

                const grouped = {};
                data.orders
                    .sort((a, b) => new Date(a.orderedOn) - new Date(b.orderedOn))
                    .forEach((order) => {
                        const userId = order.userId?._id || 'Unknown';
                        if (!grouped[userId]) grouped[userId] = [];
                        grouped[userId].push(order);
                    });

                setGroupedOrders(grouped);
            } catch (err) {
                console.error(err);
                notyf.error('Failed to fetch orders');
            }
        };

        fetchOrders();
    }, [showOrders, fetchData, notyf]);

    return (
        <Container fluid className="p-3 p-md-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center mb-0 fw-bold">Admin Dashboard</h2>
                </Col>
            </Row>

            <Row className="justify-content-center mb-4">
                <Col xs="12" className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button
                        variant="primary"
                        onClick={() => setShowAddProduct(true)}
                        className="flex-fill flex-sm-grow-0"
                        size="lg"
                    >
                        Add Product
                    </Button>
                    <Button
                        variant={showOrders ? 'danger' : 'success'}
                        onClick={toggleOrdersView}
                        className="flex-fill flex-sm-grow-0"
                        size="lg"
                    >
                        {showOrders ? 'Show Products' : 'Show Orders'}
                    </Button>
                </Col>
            </Row>

            <AddProduct
                show={showAddProduct}
                handleClose={() => setShowAddProduct(false)}
                fetchData={fetchData}
            />

            {showOrders ? (
                <div className="mt-4">
                    {Object.entries(groupedOrders).map(([userId, orders]) => {
                        const firstOrder = orders[0];
                        const userName = firstOrder.userId?.firstName
                            ? `${firstOrder.userId.firstName} ${firstOrder.userId.lastName}`
                            : 'Unknown User';
                        const isExpanded = expandedUsers[userId] || false;

                        return (
                            <Card key={userId} className="mb-3 shadow-sm">
                                <Card.Header
                                    className="bg-dark text-white"
                                    onClick={() => toggleUserOrders(userId)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Row className="align-items-center">
                                        <Col>
                                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                                                <strong className="mb-1 mb-md-0">
                                                    Orders for {userName}
                                                </strong>
                                                <small 
                                                    className="text-light ms-md-2"
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    ({isExpanded ? 'Hide' : 'Show'})
                                                </small>
                                            </div>
                                            <small className="text-warning d-block d-md-inline mt-1 mt-md-0">
                                                User ID: {userId}
                                            </small>
                                        </Col>
                                    </Row>
                                </Card.Header>

                                {isExpanded && (
                                    <Card.Body className="p-3">
                                        {orders.map((order) => (
                                            <div key={order._id} className="mb-3 p-3 border rounded">
                                                <div className="mb-2">
                                                    <strong>Purchased on:</strong> {formatDate(order.orderedOn)}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Items:</strong>
                                                    <ul className="mb-1 mt-2">
                                                        {order.productsOrdered.map((item, idx) => (
                                                            <li key={idx} className="mb-2">
                                                                {item.productId?.name || 'Product'} 
                                                                <br />
                                                                <small className="text-muted">
                                                                    Quantity: {item.quantity} • 
                                                                    ₱{(item.productId?.price * item.quantity).toLocaleString()}
                                                                </small>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="d-flex align-items-center mt-2 pt-2 border-top">
                                                    <span className="fw-bold me-2">Total:</span>
                                                    <span className="fw-bold text-warning fs-6">
                                                        ₱{(order.totalPrice || 0).toLocaleString(undefined, { 
                                                            minimumFractionDigits: 2, 
                                                            maximumFractionDigits: 2 
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </Card.Body>
                                )}
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Row className="mt-4">
                    <Col>
                        <div className="d-block d-lg-none">
                            {productCards.length > 0 ? (
                                productCards
                            ) : (
                                <Card className="text-center py-5">
                                    <Card.Body>
                                        <p className="text-muted mb-0">No products found</p>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>

                        <div className="d-none d-lg-block">
                            <Card className="shadow-sm">
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover mb-0">
                                            <thead className="table-dark">
                                                <tr className="text-center">
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Description</th>
                                                    <th>Price</th>
                                                    <th>Availability</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>{productTableRows}</tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            )}

            <Row className="mt-5">
                <Col>
                    <AdminUserManagement />
                </Col>
            </Row>
        </Container>
    );
}