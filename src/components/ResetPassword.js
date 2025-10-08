import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card, Nav, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { FaKey, FaUser, FaHistory, FaSave } from 'react-icons/fa';

export default function ResetPassword() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const [details, setDetails] = useState({
        firstName: '', email: '', profileImage: ''
    });

    useEffect(() => {
        if (user) {
            setDetails({
                firstName: user.firstName || 'User',
                email: user.email || '',
                profileImage: user.profileImage || ''
            });
        }
    }, [user]);

    const isActive = (path) => location.pathname === path;

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setVariant('warning');
            return;
        }

        if (password.length < 8) {
            setMessage('Password must be at least 8 characters long');
            setVariant('warning');
            return;
        }

        setIsUpdating(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword: password })
            });

            if (response.ok) {
                setMessage('Password updated successfully!');
                setVariant('success');
                setPassword('');
                setConfirmPassword('');
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to update password');
                setVariant('warning');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            setVariant('warning');
        } finally {
            setIsUpdating(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150x150?text=No+Image";
        if (imagePath.startsWith('http')) return imagePath;
        return `${process.env.REACT_APP_API_URL}${imagePath}`;
    };

    return (
        <Container className="px-3 px-md-4" style={{ 
            marginTop: user.isAdmin ? '80px' : '130px', 
            paddingTop: '20px',
            minHeight: 'calc(100vh - 180px)'
        }}>
            <Row>
                <Col xs={12} lg={3} className="mb-3 mb-lg-0">
                    <div className="fixed-sidebar-container">
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-3 p-md-4">
                                <div className="d-flex flex-column align-items-center text-center mb-3 mb-md-4">
                                    <Image 
                                        src={getImageUrl(details.profileImage)} 
                                        roundedCircle 
                                        width={70} 
                                        height={70} 
                                        className="border mb-2 mb-md-3"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <h6 className="fw-bold mb-1 small small-md-base">{details.firstName}</h6>
                                    <small className="text-muted text-truncate w-100">{details.email}</small>
                                </div>

                                <Nav className="flex-column gap-1 gap-md-2">
                                    <h6 className="text-muted small fw-bold mb-2">MY ACCOUNT</h6>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-2 p-md-3 rounded ${isActive('/profile') ? 'bg-primary text-white' : 'text-dark'}`}
                                        onClick={() => navigate("/profile")}
                                    >
                                        <FaUser className="me-2 me-md-3" size={14} />
                                        <span className="small small-md-base">Profile</span>
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-2 p-md-3 rounded ${isActive('/reset-password') ? 'bg-primary text-white' : 'text-dark'}`}
                                        onClick={() => navigate("/reset-password")}
                                    >
                                        <FaKey className="me-2 me-md-3" size={14} />
                                        <span className="small small-md-base">Reset Password</span>
                                    </Nav.Link>
                                    
                                    <h6 className="text-muted small fw-bold mb-2 mt-2 mt-md-3">MY PURCHASES</h6>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-2 p-md-3 rounded ${isActive('/orders') ? 'bg-primary text-white' : 'text-dark'}`}
                                        onClick={() => navigate("/orders")}
                                    >
                                        <FaHistory className="me-2 me-md-3" size={14} />
                                        <span className="small small-md-base">Order History</span>
                                    </Nav.Link>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                <Col xs={12} lg={9} className="mt-3 mt-lg-0">
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-3 p-md-4">
                            <div className="d-flex align-items-center mb-3 mb-md-4">
                                <FaKey className="text-primary me-2 me-md-3" size={20} />
                                <div>
                                    <h4 className="fw-bold mb-1 h5 h-md-4">Reset Password</h4>
                                    <p className="text-muted mb-0 small small-md-base">Update your account password</p>
                                </div>
                            </div>

                            <Form onSubmit={handleResetPassword}>
                                <Row>
                                    <Col xs={12} md={8} lg={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold small small-md-base">New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="Enter new password"
                                                minLength={8}
                                                className="py-2"
                                                size="sm"
                                            />
                                            <Form.Text className="text-muted small">
                                                Must be at least 8 characters long
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3 mb-md-4">
                                            <Form.Label className="fw-semibold small small-md-base">Confirm New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                placeholder="Confirm new password"
                                                className="py-2"
                                                size="sm"
                                            />
                                            <Form.Text className={`small ${password === confirmPassword && confirmPassword !== "" ? "text-success" : "text-muted"}`}>
                                                {password === confirmPassword && confirmPassword !== "" ? "✓ Passwords match" : "Passwords must match"}
                                            </Form.Text>
                                        </Form.Group>

                                        {message && (
                                            <Alert variant={variant} className="mb-3 mb-md-4 small">
                                                {message}
                                            </Alert>
                                        )}

                                        <Button 
                                            type="submit" 
                                            disabled={isUpdating} 
                                            variant="primary" 
                                            className="px-3 px-md-4 py-2 w-100 w-md-auto"
                                            size="sm"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="me-2" />
                                                    Update Password
                                                </>
                                            )}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}