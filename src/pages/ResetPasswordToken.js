import { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import { FaCheckCircle, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import 'notyf/notyf.min.css';

export default function ResetPasswordToken() {
    const notyf = new Notyf();
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (!token) {
            setError('Invalid reset link');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:4000/users/reset-password/${token}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                notyf.success('Password reset successfully! You can now login with your new password.');
                
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.error || 'Failed to reset password. The link may have expired.');
                notyf.error(data.error || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError('Network error. Please try again.');
            notyf.error('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <Row className="w-100 justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <Card className="shadow-sm border-0 text-center">
                            <Card.Body className="p-5">
                                <div className="text-success mb-4">
                                    <FaCheckCircle size={64} />
                                </div>
                                <h3 className="fw-bold text-dark mb-3">Password Reset Successful!</h3>
                                <p className="text-muted mb-4">
                                    Your password has been reset successfully. You will be redirected to the login page shortly.
                                </p>
                                <div className="spinner-border text-primary mb-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted small">Redirecting to login...</p>
                                <Button as={Link} to="/login" variant="primary" className="mt-3">
                                    Go to Login Now
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-dark mb-3">Create New Password</h2>
                        <p className="text-muted">Enter your new password below</p>
                    </div>

                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4 p-md-5">
                            {error && (
                                <Alert variant="danger" className="d-flex align-items-center">
                                    <FaExclamationTriangle className="me-2" />
                                    {error}
                                </Alert>
                            )}

                            {!token && (
                                <Alert variant="warning" className="text-center">
                                    <FaExclamationTriangle className="me-2" />
                                    Invalid reset link. Please request a new password reset.
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">
                                        New Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="py-3 rounded-2"
                                        disabled={isLoading || !token}
                                    />
                                    <Form.Text className="text-muted">
                                        Must be at least 8 characters long
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">
                                        Confirm New Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="py-3 rounded-2"
                                        disabled={isLoading || !token}
                                    />
                                    <Form.Text className={newPassword === confirmPassword && confirmPassword !== "" ? "text-success" : "text-muted"}>
                                        {newPassword === confirmPassword && confirmPassword !== "" ? "✓ Passwords match" : "Passwords must match"}
                                    </Form.Text>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 py-3 rounded-2 fw-bold"
                                    disabled={isLoading || !newPassword || !confirmPassword || !token}
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="me-2" />
                                            Reset Password
                                        </>
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <Link to="/login" className="text-decoration-none text-primary fw-bold me-3">
                                    <FaArrowLeft className="me-2" />
                                    Back to Sign In
                                </Link>
                                <Link to="/forgot-password" className="text-decoration-none text-muted">
                                    Need a new reset link?
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}