import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Table, Button, Container, Row, Col, Card } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminUserManagement() {
    const notyf = useMemo(() => new Notyf(), []);
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);

    const fetchAllUsers = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else if (data.error) {
                notyf.error(data.error);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            notyf.error('Failed to fetch users');
        }
    }, [notyf]);

    useEffect(() => {
        if (user?.isAdmin) {
            fetchAllUsers();
        }
    }, [user, fetchAllUsers]);

    const makeAdmin = async (userId) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/set-as-admin`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await res.json();

            if (data.updateUser) {
                notyf.success(`${data.updateUser.firstName} is now an Admin`);
                fetchAllUsers();
            } else if (data.error) {
                notyf.error(data.error);
                console.error('Error details:', data.details || '');
            }
        } catch (error) {
            console.error('Error making user admin:', error);
            notyf.error('Failed to update user');
        }
    };

    if (!user?.isAdmin) {
        return (
            <Container className="mt-4 text-center">
                <h2>Access Denied</h2>
                <p>You must be an administrator to access this page.</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <h2 className="text-center mb-3">User Management</h2>
                    <Card>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((userItem) => (
                                        <tr key={userItem._id}>
                                            <td>{userItem.firstName} {userItem.lastName}</td>
                                            <td>{userItem.email}</td>
                                            <td>{userItem.isAdmin ? 'Admin' : 'User'}</td>
                                            <td>
                                                {!userItem.isAdmin && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => makeAdmin(userItem._id)}
                                                    >
                                                        Make Admin
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {users.length === 0 && (
                                <p className="text-center mt-3">No users found.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}