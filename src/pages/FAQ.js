import { useState, useContext } from 'react';
import { Container, Row, Col, Card, Accordion, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function FAQ() {
    const [openItem, setOpenItem] = useState(null);
    const { user } = useContext(UserContext);

    const faqItems = [
        { question: "What payment methods do you accept?", answer: "We accept credit/debit cards, GCash, Maya, bank transfers, and cash on delivery for eligible areas." },
        { question: "How can I track my order?", answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account." },
        { question: "Do you offer student discounts?", answer: "Yes! We offer special student discounts. Please present your valid student ID during purchase or contact our support team." },
        { question: "What is your return policy?", answer: "We offer 30-day returns for items in original condition with complete packaging and accessories." },
        { question: "Do you ship to provinces?", answer: "Yes, we ship nationwide across the Philippines. Shipping fees and delivery times may vary by location." },
        { question: "Can I cancel my order?", answer: "You can cancel your order within 1 hour of placement. After that, orders enter processing and cannot be cancelled." },
        { question: "Are your products authentic?", answer: "Yes! All our products are 100% authentic and come with official manufacturer warranties." },
        { question: "How do I create an account?", answer: "Click on 'Register' at the top right corner and fill out the required information to create your account." }
    ];


    const topMargin = user.isAdmin ? '80px' : '120px';

    return (
        <Container className="mb-5" style={{ marginTop: topMargin }}>
            <Row className="justify-content-center">
                <Col lg={10}>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold text-primary mb-3">Frequently Asked Questions</h1>
                        <p className="lead text-muted">
                            Find answers to common questions about shopping with Zuittech
                        </p>
                    </div>

                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            <Accordion flush>
                                {faqItems.map((item, index) => (
                                    <Accordion.Item key={index} eventKey={index.toString()} className="border-0">
                                        <Accordion.Header className="p-4 border-bottom" onClick={() => setOpenItem(openItem === index ? null : index)}>
                                            <span className="fw-semibold">{item.question}</span>
                                        </Accordion.Header>
                                        <Accordion.Body className="p-4 bg-light">
                                            <p className="text-muted mb-0">{item.answer}</p>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm mt-4">
                        <Card.Body className="p-4 text-center">
                            <h5 className="fw-bold mb-3">Still Have Questions?</h5>
                            <p className="text-muted mb-3">
                                Can't find the answer you're looking for? Our customer service team is here to help!
                            </p>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Button 
                                    as={Link} 
                                    to="/contact" 
                                    variant="primary" 
                                    size="lg"
                                >
                                    Contact Support
                                </Button>
                                <Button 
                                    as={Link} 
                                    to="/products" 
                                    variant="outline-primary" 
                                    size="lg"
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}