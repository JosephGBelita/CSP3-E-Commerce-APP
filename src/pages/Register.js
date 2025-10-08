import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import 'notyf/notyf.min.css';

export default function Register() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const isValid = firstName !== "" && 
                       lastName !== "" && 
                       email !== "" && 
                       mobileNo.length === 9 &&
                       password !== "" && 
                       confirmPassword !== "" && 
                       password === confirmPassword &&
                       password.length >= 8;
        setIsActive(isValid);
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

    const registerUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    firstName, 
                    lastName, 
                    email, 
                    mobileNo: `63${mobileNo}`,
                    password 
                })
            });

            const data = await response.json();

            if (data.message === "User registered successfully") {
                setFirstName('');
                setLastName('');
                setEmail('');
                setMobileNo('');
                setPassword('');
                setConfirmPassword('');
                notyf.success("🎉 Account created successfully! Welcome to Zuittech!");
                navigate('/login');
            } else {
                notyf.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error('Registration error:', error);
            notyf.error("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleMobileNoChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 9) {
            setMobileNo(value);
        }
    };

    if (user.id !== null) {
        return <Navigate to="/products" />;
    }

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-dark mb-3">Create Your Account</h2>
                    </div>

                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4 p-md-5">
                            <Form onSubmit={registerUser}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-dark">
                                                <FaUser className="me-2 text-primary" />
                                                First Name
                                            </Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter first name" 
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)} 
                                                required 
                                                className="py-3 rounded-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-dark">
                                                Last Name
                                            </Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter last name" 
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)} 
                                                required 
                                                className="py-3 rounded-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-dark">
                                        <FaEnvelope className="me-2 text-primary" />
                                        Email Address
                                    </Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Enter email address" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)} 
                                        required 
                                        className="py-3 rounded-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-dark">
                                        <FaPhone className="me-2 text-primary" />
                                        Mobile Number
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light">+63</InputGroup.Text>
                                        <Form.Control 
                                            type="tel" 
                                            placeholder="912345678" 
                                            value={mobileNo}
                                            onChange={handleMobileNoChange}
                                            required 
                                            className="py-3 rounded-2"
                                            maxLength={9}
                                        />
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        {mobileNo.length === 9 ? "✓ Valid 9-digit number" : "Enter 9-digit number (e.g., 912345678)"}
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-dark">
                                        <FaLock className="me-2 text-primary" />
                                        Password
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="Create password" 
                                            value={password}
                                            onChange={e => setPassword(e.target.value)} 
                                            required 
                                            className="py-3 rounded-2"
                                        />
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={togglePasswordVisibility}
                                            className="border-start-0"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </InputGroup>
                                    <Form.Text className={password.length >= 8 ? "text-success" : "text-muted"}>
                                        {password.length >= 8 ? "✓ Strong password" : "Must be at least 8 characters"}
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">
                                        Confirm Password
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            placeholder="Confirm your password" 
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)} 
                                            required 
                                            className="py-3 rounded-2"
                                        />
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="border-start-0"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </InputGroup>
                                    <Form.Text className={password === confirmPassword && confirmPassword !== "" ? "text-success" : "text-muted"}>
                                        {password === confirmPassword && confirmPassword !== "" ? "✓ Passwords match" : "Passwords must match"}
                                    </Form.Text>
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
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <FaUserPlus className="me-2" />
                                            Create Account
                                        </>
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <p className="text-muted mb-0">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}