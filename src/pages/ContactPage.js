import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeadset, FaLaptop } from 'react-icons/fa';

export default function Contact() {
    return (
        <Container className="my-5 pt-4">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold text-primary mb-3">Contact Us</h1>
                        <p className="lead text-muted">
                            We're here to help! Get in touch with us through any of the following channels.
                        </p>
                    </div>

                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary rounded-circle p-3 me-3">
                                            <FaHeadset size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Customer Service</h4>
                                    </div>
                                    <p className="text-muted mb-4">
                                        For general inquiries, order status, and customer support
                                    </p>
                                    <div className="ps-2">
                                        <div className="d-flex align-items-center mb-2">
                                            <FaPhone className="text-primary me-3" />
                                            <span className="fw-semibold">(02) 5328-7800</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <FaPhone className="text-primary me-3" />
                                            <span className="fw-semibold">(02) 8521-3660</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FaPhone className="text-primary me-3" />
                                            <span className="fw-semibold">(02) 8521-3656</span>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-success rounded-circle p-3 me-3">
                                            <FaLaptop size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Sales & PC Build</h4>
                                    </div>
                                    <p className="text-muted mb-4">
                                        For telemarketing and custom PC build inquiries
                                    </p>
                                    <div className="ps-2">
                                        <div className="d-flex align-items-center mb-2">
                                            <FaPhone className="text-success me-3" />
                                            <span className="fw-semibold">0912-345-6789</span>
                                        </div>
                                        <small className="text-muted">
                                            Available during business hours
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-warning rounded-circle p-3 me-3">
                                            <FaEnvelope size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Email Support</h4>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <h6 className="fw-semibold text-dark mb-2">Order & Shipment</h6>
                                        <div className="d-flex align-items-start mb-2 ps-2">
                                            <FaEnvelope className="text-warning me-3 mt-1" />
                                            <div>
                                                <span className="fw-semibold">ecommerce@shopzuitt.com.ph</span>
                                                <small className="d-block text-muted mt-1">
                                                    For payment and shipment inquiries
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h6 className="fw-semibold text-dark mb-2">Technical Support</h6>
                                        <div className="d-flex align-items-start ps-2">
                                            <FaEnvelope className="text-warning me-3 mt-1" />
                                            <div>
                                                <span className="fw-semibold">customercare@shopzuitt.com.ph</span>
                                                <small className="d-block text-muted mt-1">
                                                    For product technical issues
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-danger rounded-circle p-3 me-3">
                                            <FaMapMarkerAlt size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Our Business Address</h4>
                                    </div>
                                    <p className="text-muted mb-4">
                                        Visit our main office during business hours
                                    </p>
                                    <div className="ps-2">
                                        <div className="d-flex align-items-start mb-3">
                                            <FaMapMarkerAlt className="text-danger me-3 mt-1" />
                                            <div>
                                                <h6 className="fw-bold mb-1">ShopZuitt</h6>
                                                <p className="mb-1">Turkey St.</p>
                                                <p className="mb-1">Bacoor, Cavite</p>
                                                <p className="mb-0">Philippines 4102</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h6 className="fw-semibold mb-2">Business Hours</h6>
                                            <div className="text-muted">
                                                <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                                                <div>Saturday: 9:00 AM - 2:00 PM</div>
                                                <div>Sunday: Closed</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}