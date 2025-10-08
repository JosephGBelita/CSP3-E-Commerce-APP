import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaTruck, FaClock, FaMapMarkerAlt, FaBox, FaShieldAlt } from 'react-icons/fa';

export default function ShippingInfo() {
    return (
        <Container className="mb-5" style={{ marginTop: '130px' }}>
            <Row className="justify-content-center">
                <Col lg={10}>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold text-primary mb-3 display-4">Shipping Information</h1>
                        <p className="lead fs-3">
                            Fast, reliable shipping across the Philippines
                        </p>
                    </div>

                    <Row className="g-4 mb-5">
                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary rounded-circle p-3 me-3">
                                            <FaTruck size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Standard Shipping</h4>
                                    </div>
                                    <Badge bg="success" className="mb-3">3-5 Business Days</Badge>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2">✓ Free shipping for orders over ₱2,000</li>
                                        <li className="mb-2">✓ ₱100 shipping fee for orders below ₱2,000</li>
                                        <li className="mb-2">✓ Nationwide delivery</li>
                                        <li className="mb-2">✓ Tracking number provided</li>
                                        <li>✓ Delivery Monday to Saturday</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-warning rounded-circle p-3 me-3">
                                            <FaClock size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Express Shipping</h4>
                                    </div>
                                    <Badge bg="danger" className="mb-3">1-2 Business Days</Badge>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2">✓ ₱250 flat rate nationwide</li>
                                        <li className="mb-2">✓ Priority processing</li>
                                        <li className="mb-2">✓ Real-time tracking</li>
                                        <li className="mb-2">✓ Same-day dispatch for orders before 2PM</li>
                                        <li>✓ Delivery Monday to Saturday</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="border-0 bg-light h-100">
                                <Card.Body className="p-4 text-center">
                                    <FaMapMarkerAlt size={32} className="text-primary mb-3" />
                                    <h5 className="fw-bold">Delivery Areas</h5>
                                    <p className="text-muted mb-0">
                                        We deliver to all major cities and provinces across the Philippines
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card className="border-0 bg-light h-100">
                                <Card.Body className="p-4 text-center">
                                    <FaBox size={32} className="text-warning mb-3" />
                                    <h5 className="fw-bold">Order Processing</h5>
                                    <p className="text-muted mb-0">
                                        Orders processed within 24 hours during business days
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card className="border-0 bg-light h-100">
                                <Card.Body className="p-4 text-center">
                                    <FaShieldAlt size={32} className="text-success mb-3" />
                                    <h5 className="fw-bold">Secure Packaging</h5>
                                    <p className="text-muted mb-0">
                                        All items are carefully packaged to ensure safe delivery
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="border-0 bg-light mt-5">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3">Important Shipping Notes</h5>
                            <Row>
                                <Col md={6}>
                                    <ul className="text-muted">
                                        <li className="mb-2">Delivery times may vary during holidays and peak seasons</li>
                                        <li className="mb-2">Some remote areas may experience longer delivery times</li>
                                        <li>Signature may be required upon delivery</li>
                                    </ul>
                                </Col>
                                <Col md={6}>
                                    <ul className="text-muted">
                                        <li className="mb-2">Please ensure your shipping address is complete and accurate</li>
                                        <li className="mb-2">Contact customer service for special delivery requests</li>
                                        <li>Track your order using the provided tracking number</li>
                                    </ul>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}