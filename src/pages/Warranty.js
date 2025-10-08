import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { FaShieldAlt, FaTools, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function Warranty() {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold text-primary mb-3">Warranty Information</h1>
                        <p className="lead text-muted">
                            Comprehensive protection for your purchases
                        </p>
                    </div>

                    <Alert variant="info" className="mb-4">
                        <FaShieldAlt className="me-2" />
                        <strong>Peace of Mind:</strong> All our products come with manufacturer warranties for your protection.
                    </Alert>

                    <Row className="g-4 mb-5">
                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-success rounded-circle p-3 me-3">
                                            <FaCheckCircle size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Standard Warranty</h4>
                                    </div>
                                    <Badge bg="success" className="mb-3">1 Year</Badge>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2">✓ Manufacturing defects coverage</li>
                                        <li className="mb-2">✓ Parts and labor included</li>
                                        <li className="mb-2">✓ Service center repairs</li>
                                        <li className="mb-2">✓ Free pickup and delivery for warranty claims</li>
                                        <li>✓ Online warranty registration available</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-warning rounded-circle p-3 me-3">
                                            <FaTools size={24} className="text-white" />
                                        </div>
                                        <h4 className="fw-bold mb-0">Extended Warranty</h4>
                                    </div>
                                    <Badge bg="warning" className="mb-3">Up to 3 Years</Badge>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2">✓ Extended coverage periods available</li>
                                        <li className="mb-2">✓ Additional protection plans</li>
                                        <li className="mb-2">✓ Accidental damage coverage (select plans)</li>
                                        <li className="mb-2">✓ On-site service options</li>
                                        <li>✓ Priority technical support</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body className="p-4">
                            <h4 className="fw-bold mb-4">Warranty Claim Process</h4>
                            <Row className="g-4">
                                <Col md={4} className="text-center">
                                    <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <strong>1</strong>
                                    </div>
                                    <h6 className="fw-bold">Contact Support</h6>
                                    <p className="text-muted small">
                                        Reach out to our warranty team with your product details and issue description
                                    </p>
                                </Col>
                                <Col md={4} className="text-center">
                                    <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <strong>2</strong>
                                    </div>
                                    <h6 className="fw-bold">Diagnosis & Approval</h6>
                                    <p className="text-muted small">
                                        Our technicians will diagnose the issue and approve warranty coverage
                                    </p>
                                </Col>
                                <Col md={4} className="text-center">
                                    <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <strong>3</strong>
                                    </div>
                                    <h6 className="fw-bold">Repair/Replacement</h6>
                                    <p className="text-muted small">
                                        We'll repair or replace your product and return it to you
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 bg-light">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3 text-danger">
                                <FaExclamationTriangle className="me-2" />
                                Warranty Exclusions
                            </h5>
                            <Row>
                                <Col md={6}>
                                    <ul className="text-muted">
                                        <li className="mb-2">Physical damage from accidents or misuse</li>
                                        <li className="mb-2">Water or liquid damage</li>
                                        <li className="mb-2">Unauthorized repairs or modifications</li>
                                    </ul>
                                </Col>
                                <Col md={6}>
                                    <ul className="text-muted">
                                        <li className="mb-2">Normal wear and tear</li>
                                        <li className="mb-2">Software issues not related to hardware</li>
                                        <li>Damage from power surges or natural disasters</li>
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