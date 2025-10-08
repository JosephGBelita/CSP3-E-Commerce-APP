import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { 
    FaFacebook, 
    FaInstagram, 
    FaYoutube, 
    FaTiktok 
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
            <Container>
                <Row className="gy-4">
                    
                    <Col lg={4} md={6} xs={12}>
                        <div className="mb-4 text-center text-md-start">
                            <img 
                                src="/images/Zuittlogo.png" 
                                alt="ShopZuitt logo" 
                                className="img-fluid"
                                style={{ 
                                    width: "120px", 
                                    filter: "brightness(0) invert(1)" 
                                }}
                            />
                        </div>
                        <p className="text-light-emphasis small mb-4 text-center text-md-start">
                            Your one-stop shop for the latest electronics and gadgets. 
                            Experience quality, speed, and trusted service in every purchase.
                        </p>
                        <h6 className="fw-bold text-white mb-3 text-center text-md-start">
                            Follow Us
                        </h6>
                        <div className="d-flex gap-2 justify-content-center justify-content-md-start flex-wrap">
                            <Button 
                                as="a" 
                                href="https://facebook.com/shopzuitt" 
                                target="_blank" 
                                variant="outline-light" 
                                size="sm" 
                                title="Facebook"
                            >
                                <FaFacebook />
                            </Button>
                            <Button 
                                as="a" 
                                href="https://instagram.com/shopzuitt" 
                                target="_blank" 
                                variant="outline-light" 
                                size="sm" 
                                title="Instagram"
                            >
                                <FaInstagram />
                            </Button>
                            <Button 
                                as="a" 
                                href="https://youtube.com/shopzuitt" 
                                target="_blank" 
                                variant="outline-light" 
                                size="sm" 
                                title="YouTube"
                            >
                                <FaYoutube />
                            </Button>
                            <Button 
                                as="a" 
                                href="https://tiktok.com/@shopzuitt" 
                                target="_blank" 
                                variant="outline-light" 
                                size="sm" 
                                title="TikTok"
                            >
                                <FaTiktok />
                            </Button>
                        </div>
                    </Col>

                    <Col lg={2} md={6} xs={12}>
                        <h6 className="fw-bold text-white mb-3 text-center text-md-start">
                            Quick Links
                        </h6>
                        <div className="d-flex flex-column gap-2 text-center text-md-start">
                            <Link to="/" className="text-decoration-none text-light">
                                Home
                            </Link>
                            <Link to="/products" className="text-decoration-none text-light">
                                Products
                            </Link>
                            <Link to="/about" className="text-decoration-none text-light">
                                About Us
                            </Link>
                            <Link to="/contact" className="text-decoration-none text-light">
                                Contact
                            </Link>
                        </div>
                    </Col>

                    <Col lg={3} md={6} xs={12}>
                        <h6 className="fw-bold text-white mb-3 text-center text-md-start">
                            Shop Categories
                        </h6>
                        <div className="d-flex flex-column gap-2 text-center text-md-start">
                            <Link 
                                to="/products/category/Smartphones & Tablets" 
                                className="text-decoration-none text-light"
                            >
                                Smartphones & Tablets
                            </Link>
                            <Link 
                                to="/products/category/Laptops & Computers" 
                                className="text-decoration-none text-light"
                            >
                                Laptops & Computers
                            </Link>
                            <Link 
                                to="/products/category/Gaming" 
                                className="text-decoration-none text-light"
                            >
                                Gaming
                            </Link>
                            <Link 
                                to="/products/category/Audio" 
                                className="text-decoration-none text-light"
                            >
                                Audio
                            </Link>
                            <Link 
                                to="/products/category/Accessories" 
                                className="text-decoration-none text-light"
                            >
                                Accessories
                            </Link>
                        </div>
                    </Col>

                    <Col lg={3} md={6} xs={12}>
                        <h6 className="fw-bold text-white mb-3 text-center text-md-start">
                            Customer Service
                        </h6>
                        <div className="d-flex flex-column gap-2 text-center text-md-start">
                            <Link to="/contact" className="text-decoration-none text-light">
                                Contact Support
                            </Link>
                            <Link to="/shipping" className="text-decoration-none text-light">
                                Shipping Info
                            </Link>
                            <Link to="/returns" className="text-decoration-none text-light">
                                Returns & Refunds
                            </Link>
                            <Link to="/faq" className="text-decoration-none text-light">
                                FAQ
                            </Link>
                            <Link to="/warranty" className="text-decoration-none text-light">
                                Warranty
                            </Link>
                        </div>
                    </Col>
                </Row>

                <hr className="my-4 border-secondary" />

                <Row className="align-items-center">
                    <Col className="text-center">
                        <p className="mb-0 text-light-emphasis small">
                            &copy; {currentYear} ShopZuitt. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}