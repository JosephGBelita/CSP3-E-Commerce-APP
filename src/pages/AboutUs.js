import { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {  FaShieldAlt, FaTruck, FaHeadset, FaRocket, FaHeart, FaCode, FaGraduationCap, FaDatabase, FaServer, FaReact, FaNodeJs } from 'react-icons/fa';
import UserContext from '../context/UserContext';

export default function AboutUs() {
    const { user } = useContext(UserContext);
    const topMargin = user.isAdmin ? '80px' : '60px';

    return (
        <Container style={{ marginTop: topMargin }} className="mb-5">
            <div className="bg-light">
                <Container className="pt-5">
                    <Row className="justify-content-center">
                        <Col lg={10} className="text-center">
                            <img 
                                src="/images/people.png" 
                                alt="My Zuittech Project" 
                                className="img-fluid w-100 mb-4"
                                style={{ 
                                    maxHeight: '500px', 
                                    objectFit: 'cover',
                                    borderRadius: '0'
                                }}
                            />
                            <h1 className="fw-bold text-dark mb-3">About ShopZuitt</h1>
                            <p className="lead text-muted mb-4">
                                My Personal E-commerce Platform Project
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Row className="justify-content-center my-5">
                <Col lg={8}>
                    <div className="text-center mb-5">
                        <FaGraduationCap size={40} className="text-primary mb-3" />
                        <h2 className="fw-bold text-dark mb-4">My Personal Project Journey</h2>
                        <p className="text-muted lead">
                            This project represents my journey learning full-stack development and building a complete application from scratch.
                        </p>
                    </div>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-5">
                            <h3 className="fw-bold text-dark mb-4 text-center">Why I Built This</h3>
                            <Row className="align-items-center">
                                <Col md={6}>
                                    <p className="text-muted mb-4">
                                        This was my capstone project for my Zuitt bootcamp. I had to build an e-commerce website, but I didn't want to just do the minimum. 
                                        I kept working on it even after the class ended.
                                    </p>
                                    <p className="text-muted mb-4">
                                        I added new features beyond what we covered in class, such as a more advanced admin dashboard, improved product management, and enhanced user profiles. I researched best practices and followed developer tutorials online to make it function more like a real-world e-commerce platform.
                                    </p>
                                    <p className="text-muted">
                                        It's not perfect but I'm proud of it. This project shows what I can do when I really put my mind to learning something new.
                                    </p>
                                </Col>
                                <Col md={6} className="text-center">
                                    <FaCode size={80} className="text-primary mb-3" />
                                    <h5 className="fw-bold text-dark">Built From Scratch</h5>
                                    <p className="text-muted">My hands-on learning project</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col>
                    <h2 className="fw-bold text-center text-dark mb-5">What I Implemented</h2>
                    <Row className="g-4">
                        <Col md={4} sm={6}>
                            <Card className="border-0 shadow-sm h-100 text-center">
                                <Card.Body className="p-4">
                                    <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <FaShieldAlt size={24} />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-2">User System</h5>
                                    <p className="text-muted small">
                                        Registration, login, and profile management with secure authentication.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} sm={6}>
                            <Card className="border-0 shadow-sm h-100 text-center">
                                <Card.Body className="p-4">
                                    <div className="bg-success rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <FaTruck size={24} />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-2">Shopping Experience</h5>
                                    <p className="text-muted small">
                                        Product browsing, cart management, and checkout process.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} sm={6}>
                            <Card className="border-0 shadow-sm h-100 text-center">
                                <Card.Body className="p-4">
                                    <div className="bg-warning rounded-circle p-3 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                        <FaHeadset size={24} />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-2">Admin Features</h5>
                                    <p className="text-muted small">
                                        Product management, user administration, and order processing.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="g-4 mb-5">
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary rounded p-2 me-3">
                                    <FaRocket size={20} className="text-white" />
                                </div>
                                <h4 className="fw-bold text-dark mb-0">My Goals</h4>
                            </div>
                            <p className="text-muted mb-0">
                                To master full-stack development, understand how real applications work, 
                                and build a portfolio project that demonstrates my skills and dedication.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-success rounded p-2 me-3">
                                    <FaHeart size={20} className="text-white" />
                                </div>
                                <h4 className="fw-bold text-dark mb-0">Skills I Gained</h4>
                            </div>
                            <p className="text-muted mb-0">
                                MERN stack, REST APIs, database design, responsive web design, 
                                and deployment — all through hands-on building.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            <Card className="border-0 bg-light mb-5">
                <Card.Body className="p-5">
                    <h3 className="fw-bold text-center text-dark mb-4">Technologies I Used</h3>
                    <Row className="text-center g-4">
                        <Col md={3} sm={6}>
                            <div className="bg-primary rounded-circle p-4 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                <FaDatabase size={32} />
                            </div>
                            <h4 className="fw-bold text-primary">MongoDB</h4>
                            <p className="text-muted fw-semibold">Database</p>
                        </Col>
                        <Col md={3} sm={6}>
                            <div className="bg-success rounded-circle p-4 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                <FaServer size={32} />
                            </div>
                            <h4 className="fw-bold text-success">Express.js</h4>
                            <p className="text-muted fw-semibold">Backend</p>
                        </Col>
                        <Col md={3} sm={6}>
                            <div className="bg-warning rounded-circle p-4 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                <FaReact size={32} />
                            </div>
                            <h4 className="fw-bold text-warning">React</h4>
                            <p className="text-muted fw-semibold">Frontend</p>
                        </Col>
                        <Col md={3} sm={6}>
                            <div className="bg-info rounded-circle p-4 d-inline-flex align-items-center justify-content-center text-white mb-3">
                                <FaNodeJs size={32} />
                            </div>
                            <h4 className="fw-bold text-info">Node.js</h4>
                            <p className="text-muted fw-semibold">Server</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-5 text-center">
                    <h3 className="fw-bold text-dark mb-3">Check Out My Work</h3>
                    <p className="text-muted mb-4 lead">
                        This is my personal project — feel free to explore and test all the features I built.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <a href="/products" className="btn btn-primary btn-lg px-4">
                            See Products
                        </a>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
