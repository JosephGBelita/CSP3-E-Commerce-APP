import { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import { FaEnvelope, FaArrowLeft, FaKey, FaCopy } from 'react-icons/fa';
import 'notyf/notyf.min.css';

export default function ForgotPassword() {
    const notyf = new Notyf();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                notyf.success('Password reset link generated!');
                setIsSubmitted(true);
                setUserEmail(email);
                
                if (data.resetToken) {
                    setResetToken(data.resetToken);
                }
            } else {
                notyf.error(data.error || 'Failed to generate reset link');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            notyf.error('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyResetLink = () => {
        const resetUrl = `${process.env.REACT_APP_API_URL}/reset-password/${resetToken}`;
        navigator.clipboard.writeText(resetUrl)
            .then(() => {
                notyf.success('Reset link copied to clipboard!');
            })
            .catch(() => {
                notyf.error('Failed to copy link');
            });
    };

    const resetForm = () => {
        setIsSubmitted(false);
        setEmail('');
        setResetToken('');
        setUserEmail('');
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-dark mb-3">Reset Your Password</h2>
                        <p className="text-muted">Enter your email address to get a reset link</p>
                    </div>

                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4 p-md-5">
                            {!isSubmitted ? (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold text-dark">
                                            <FaEnvelope className="me-2 text-primary" />
                                            Email Address
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your registered email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="py-3 rounded-2"
                                        />
                                        <Form.Text className="text-muted">
                                            Enter the email you used to register your account
                                        </Form.Text>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 py-3 rounded-2 fw-bold"
                                        disabled={isLoading || !email}
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Generating Reset Link...
                                            </>
                                        ) : (
                                            'Get Reset Link'
                                        )}
                                    </Button>
                                </Form>
                            ) : (
                                <div>
                                    <Alert variant="success" className="text-center">
                                        <FaKey className="me-2" />
                                        <strong>Reset Link Generated!</strong>
                                        <p className="mb-3 mt-2">
                                            Password reset link for <strong>{userEmail}</strong>
                                        </p>
                                    </Alert>

                                    {resetToken && (
                                        <Card className="border-primary">
                                            <Card.Body className="text-center">
                                                <h6 className="fw-bold mb-3">Click the button below to reset your password:</h6>
                                                
                                                <div className="d-grid gap-2 mb-3">
                                                    <a 
                                                        href={`/reset-password/${resetToken}`} 
                                                        className="btn btn-success btn-lg"
                                                    >
                                                        Reset Password Now
                                                    </a>
                                                </div>

                                                <div className="mb-3">
                                                    <small className="text-muted d-block mb-2">
                                                        Or copy this link:
                                                    </small>
                                                    <div className="input-group">
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            value={`http://localhost:3000/reset-password/${resetToken}`}
                                                            readOnly
                                                            style={{ fontSize: '12px' }}
                                                        />
                                                        <Button 
                                                            variant="outline-secondary" 
                                                            onClick={copyResetLink}
                                                        >
                                                            <FaCopy />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <small className="text-muted">
                                                    ⏰ This link expires in 1 hour
                                                </small>
                                            </Card.Body>
                                        </Card>
                                    )}

                                    <div className="text-center mt-4">
                                        <Button 
                                            variant="outline-primary" 
                                            onClick={resetForm}
                                            className="me-2"
                                        >
                                            Reset Another Password
                                        </Button>
                                        <Link to="/login" className="btn btn-outline-secondary">
                                            Back to Login
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {!isSubmitted && (
                                <div className="text-center mt-4">
                                    <Link to="/login" className="text-decoration-none text-primary fw-bold">
                                        <FaArrowLeft className="me-2" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}