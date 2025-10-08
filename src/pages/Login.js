import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import 'notyf/notyf.min.css';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const authenticate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.access) {
                localStorage.setItem('token', data.access);
                await retrieveUserDetails(data.access);
                setEmail('');
                setPassword('');
                notyf.success('Login successful! Welcome back!');
            } else if (data.error === 'Email and password do not match') {
                notyf.error('Incorrect email or password. Please try again.');
            } else if (data.error === 'Invalid Email') {
                notyf.error('Please enter a valid email address.');
            } else {
                notyf.error('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            notyf.error('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const retrieveUserDetails = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            const userData = data.user || data;

            setUser({
                id: userData._id,
                isAdmin: userData.isAdmin,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    if (user?.id) {
        return <Navigate to="/products" />;
    }

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-dark mb-3">Sign In to Your Account</h2>
                    </div>

                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4 p-md-5">
                            <Form onSubmit={authenticate}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-dark">
                                        <FaEnvelope className="me-2 text-primary" />
                                        Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="py-3 rounded-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">
                                        <FaLock className="me-2 text-primary" />
                                        Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="py-3 rounded-2"
                                    />
                                </Form.Group>

                                <Button
                                    variant={isActive ? 'primary' : 'secondary'}
                                    type="submit"
                                    className="w-100 py-3 rounded-2 fw-bold"
                                    disabled={!isActive || isLoading}
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            <FaSignInAlt className="me-2" />
                                            Sign In
                                        </>
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <p className="text-muted mb-2">
                                    New to ShopZuitt?{' '}
                                    <Link to="/register" className="text-primary fw-bold text-decoration-none">
                                        Create an account
                                    </Link>
                                </p>
                                <Link to="/forgot-password" className="text-decoration-none text-muted small">
                                    Forgot your password?
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}