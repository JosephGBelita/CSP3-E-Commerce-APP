import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Nav, Button, Form, Image, Alert } from 'react-bootstrap';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import { FaUser, FaKey, FaHistory, FaSave, FaUpload } from 'react-icons/fa';
import 'notyf/notyf.min.css';
import ResetPassword from '../components/ResetPassword';
import OrderHistory from '../components/OrderHistory';

export default function Profile() {
    const notyf = useMemo(() => new Notyf(), []);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [details, setDetails] = useState({
        firstName: '', lastName: '', mobileNo: '', email: '', profileImage: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fetchUserDetails = useCallback(() => {
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            const userData = data.user || data;
            if (userData && !userData.error) {
                setDetails(userData);
                setUser(prev => ({
                    ...prev,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    profileImage: userData.profileImage
                }));
            } else {
                notyf.error(userData.error || "Something went wrong.");
            }
        })
        .catch(() => notyf.error("Failed to load profile data"));
    }, [notyf, setUser]);

    useEffect(() => { 
        fetchUserDetails(); 
    }, [fetchUserDetails]);

    const handleUpdate = e => {
        e.preventDefault();
        setIsUpdating(true);
        fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                firstName: details.firstName,
                lastName: details.lastName,
                mobileNo: details.mobileNo
            })
        })
        .then(res => res.json())
        .then(data => {
            setIsUpdating(false);
            data ? notyf.success("Profile updated successfully!") : notyf.error("Failed to update profile.");
            fetchUserDetails();
        })
        .catch(() => { 
            setIsUpdating(false); 
            notyf.error("Failed to update profile."); 
        });
    };

    const handleImageChange = e => {
        if (user.isAdmin) return notyf.error("Admins cannot change profile pictures.");
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) return notyf.error("Image must be less than 2MB");

        setIsUploading(true);
        const formData = new FormData();
        formData.append('profileImage', file);

        fetch(`${process.env.REACT_APP_API_URL}/users/upload-profile-image1`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            setIsUploading(false);
            if (data.success) {
                const fullImageUrl = `http://localhost:4000${data.imageUrl}`;
                setDetails(prev => ({ ...prev, profileImage: fullImageUrl }));
                setUser(prev => ({ ...prev, profileImage: fullImageUrl }));
                notyf.success("Profile image updated successfully!");
            } else {
                notyf.error(data.error || "Failed to upload profile image");
            }
            e.target.value = '';
        })
        .catch(() => { 
            setIsUploading(false); 
            notyf.error("Error uploading profile image"); 
            e.target.value = ''; 
        });
    };

    const getImageUrl = path => !path ? "https://via.placeholder.com/150x150?text=No+Image" : (path.startsWith('http') ? path : `http://localhost:4000${path}`);
    const isActive = path => location.pathname === path;

    if (!user.id) return <Navigate to="/products" />;

    return (
        <Container className="px-3 px-md-4" style={{ 
            marginTop: user.isAdmin ? '80px' : '130px', 
            paddingTop: '20px',
            minHeight: 'calc(100vh - 180px)'
        }}>
            <Row className="mb-3 mb-md-4">
                <Col className="text-center">
                    <h1 className="fw-bold text-dark h3 h-md-1">My Account</h1>
                    <p className="text-muted mb-0">Manage your profile and account settings</p>
                </Col>
            </Row>

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
                                    <h6 className="fw-bold mb-1 small small-md-base">{details.firstName || 'User'} {details.lastName}</h6>
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
                    {location.pathname === '/profile' && (
                        <Row>
                            <Col xs={12} xl={8} className="mb-3 mb-xl-0">
                                <Card className="shadow-sm border-0 h-100">
                                    <Card.Body className="p-3 p-md-4">
                                        <div className="d-flex align-items-center mb-3 mb-md-4">
                                            <FaUser className="text-primary me-2 me-md-3" size={20} />
                                            <div>
                                                <h4 className="fw-bold mb-1 h5 h-md-4">Personal Information</h4>
                                                <p className="text-muted mb-0 small small-md-base">Update your personal details</p>
                                            </div>
                                        </div>

                                        <Form onSubmit={handleUpdate}>
                                            <Row>
                                                <Col xs={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold small small-md-base">First Name</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={details.firstName} 
                                                            onChange={e => setDetails({ ...details, firstName: e.target.value })} 
                                                            required 
                                                            className="py-2"
                                                            size="sm"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold small small-md-base">Last Name</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={details.lastName} 
                                                            onChange={e => setDetails({ ...details, lastName: e.target.value })} 
                                                            required 
                                                            className="py-2"
                                                            size="sm"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3 mb-md-4">
                                                <Form.Label className="fw-semibold small small-md-base">Mobile Number</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    value={details.mobileNo} 
                                                    onChange={e => setDetails({ ...details, mobileNo: e.target.value })} 
                                                    required 
                                                    className="py-2"
                                                    placeholder="09123456789"
                                                    size="sm"
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3 mb-md-4">
                                                <Form.Label className="fw-semibold small small-md-base">Email Address</Form.Label>
                                                <Form.Control 
                                                    type="email" 
                                                    value={details.email} 
                                                    readOnly
                                                    className="py-2 bg-light"
                                                    size="sm"
                                                />
                                                <Form.Text className="text-muted small">
                                                    Email cannot be changed
                                                </Form.Text>
                                            </Form.Group>

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
                                                        Update Profile
                                                    </>
                                                )}
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} xl={4} className="mt-3 mt-xl-0">
                                <Card className="shadow-sm border-0 h-100">
                                    <Card.Body className="p-3 p-md-4 text-center d-flex flex-column">
                                        <div className="d-flex align-items-center justify-content-center mb-2 mb-md-3">
                                            <FaUpload className="text-primary me-2" size={16} />
                                            <h5 className="fw-bold mb-0 h6 h-md-5">Profile Photo</h5>
                                        </div>
                                        
                                        <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                            <Image 
                                                src={getImageUrl(details.profileImage)} 
                                                roundedCircle 
                                                width={120} 
                                                height={120} 
                                                className="border mb-3 mb-md-4 mx-auto"
                                                style={{ objectFit: 'cover' }}
                                            />
                                            
                                            {user.isAdmin ? (
                                                <Alert variant="info" className="small mb-0">
                                                    Admins cannot change profile pictures
                                                </Alert>
                                            ) : (
                                                <Form.Group>
                                                    <Form.Control 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleImageChange} 
                                                        disabled={isUploading}
                                                        className="mb-2"
                                                        size="sm"
                                                    />
                                                    <Form.Text className="text-muted small d-block">
                                                        {isUploading ? "Uploading..." : "Max 2MB • JPEG, PNG, GIF"}
                                                    </Form.Text>
                                                </Form.Group>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {location.pathname === '/reset-password' && <ResetPassword />}
                    {location.pathname === '/orders' && <OrderHistory />}
                </Col>
            </Row>
        </Container>
    );
}