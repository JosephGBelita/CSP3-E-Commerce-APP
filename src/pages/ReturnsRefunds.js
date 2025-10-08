import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { FaUndo, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';

export default function ReturnsRefunds() {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold text-primary mb-3">Returns & Refunds Policy</h1>
                        <p className="lead text-muted">
                            Hassle-free returns within 30 days of purchase
                        </p>
                    </div>

                    <Alert variant="info" className="mb-4">
                        <FaExclamationTriangle className="me-2" />
                        <strong>Important:</strong> Please read our policy carefully before initiating a return.
                    </Alert>

                    <Row className="g-4 mb-5">
                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-success rounded-circle p-3 me-3">
                                            <FaUndo size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">30-Day Return Policy</h4>
                                    </div>
                                    <Badge bg="success" className="mb-3">30 Days</Badge>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2">✓ Items must be in original condition</li>
                                        <li className="mb-2">✓ Original packaging and accessories included</li>
                                        <li className="mb-2">✓ Free return shipping for defective items</li>
                                        <li className="mb-2">✓ Return shipping fee applies for change of mind</li>
                                        <li>✓ Proof of purchase required</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary rounded-circle p-3 me-3">
                                            <FaMoneyBillWave size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Refund Process</h4>
                                    </div>
                                    <Badge bg="primary" className="mb-3">7-14 Days</Badge>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2">✓ Refunds processed within 7-14 business days</li>
                                        <li className="mb-2">✓ Original payment method will be credited</li>
                                        <li className="mb-2">✓ Refund amount excludes original shipping fees</li>
                                        <li className="mb-2">✓ Store credit option available</li>
                                        <li>✓ Email notification sent upon refund completion</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="border-0 bg-light mb-4">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3 text-danger">Non-Returnable Items</h5>
                            <Row>
                                <Col md={6}>
                                    <ul className="text-muted">
                                        <li className="mb-2">Software and digital downloads</li>
                                        <li className="mb-2">Opened software and games</li>
                                        <li className="mb-2">Personal care items</li>
                                    </ul>
                                </Col>
                                <Col md={6}>
                                    <ul className="text-muted">
                                        <li className="mb-2">Custom-built PCs and configured items</li>
                                        <li className="mb-2">Gift cards and vouchers</li>
                                        <li>Items damaged by customer misuse</li>
                                    </ul>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <h4 className="fw-bold mb-4">How to Return an Item</h4>
                            <Row className="g-4">
                                <Col md={3} className="text-center">
                                    <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <strong>1</strong>
                                    </div>
                                    <h6 className="fw-bold">Contact Support</h6>
                                    <p className="text-muted small">
                                        Email our support team with your order details and reason for return
                                    </p>
                                </Col>
                                <Col md={3} className="text-center">
                                    <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <strong>2</strong>
                                    </div>
                                    <h6 className="fw-bold">Get Approval</h6>
                                    <p className="text-muted small">
                                        Wait for return authorization and shipping instructions
                                    </p>
                                </Col>
                                <Col md={3} className="text-center">
                                    <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <strong>3</strong>
                                    </div>
                                    <h6 className="fw-bold">Ship Item</h6>
                                    <p className="text-muted small">
                                        Package item securely and ship to provided address
                                    </p>
                                </Col>
                                <Col md={3} className="text-center">
                                    <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <strong>4</strong>
                                    </div>
                                    <h6 className="fw-bold">Receive Refund</h6>
                                    <p className="text-muted small">
                                        Get refund processed once we receive and inspect the item
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}