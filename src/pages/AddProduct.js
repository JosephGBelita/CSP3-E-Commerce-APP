import { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../context/UserContext';

export default function AddProduct({ show, handleClose, fetchData }) {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('Accessories');
    const [isNewArrival, setIsNewArrival] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const categories = [
        'Laptops & Computers',
        'Smartphones & Tablets', 
        'Gaming',
        'Audio',
        'Accessories'
    ];

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            notyf.error('Image must be less than 2MB');
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            notyf.error('Only JPEG, PNG, and GIF images are allowed');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('productImage', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/upload-image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (data.success) {
                setImageUrl(data.imageUrl);
                notyf.success('Image uploaded successfully');
            } else {
                notyf.error(data.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error details:', error);
            notyf.error(`Error uploading image: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    name,
                    description,
                    price,
                    category,
                    isNewArrival,
                    imageUrl,
                }),
            });

            const data = await response.json();

            if (data.success === true) {
                notyf.success('Product added successfully');
                setName('');
                setDescription('');
                setPrice(0);
                setCategory('Accessories');
                setIsNewArrival(false);
                setImageUrl('');
                handleClose();
                fetchData();
            } else {
                notyf.error('Failed to add product');
            }
        } catch (error) {
            console.error('Add product error:', error);
            notyf.error('Error adding product');
        }
    };

    if (!user?.isAdmin) {
        return <div className="text-center py-4">Access Denied: Only admins can add products.</div>;
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Form onSubmit={addProduct}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Check 
                            type="checkbox"
                            label="Mark as New Arrival"
                            checked={isNewArrival}
                            onChange={(e) => setIsNewArrival(e.target.checked)}
                        />
                        <Form.Text className="text-muted">
                            This product will appear in the New Arrivals section on the homepage
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isUploading}
                        />
                        <Form.Text className="text-muted">
                            {isUploading
                                ? 'Uploading...'
                                : 'Select JPEG, PNG, or GIF image (max 2MB)'}
                        </Form.Text>
                    </Form.Group>

                    {imageUrl && (
                        <div className="mb-3 text-center">
                            <img
                                src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                                alt="Product preview"
                                className="img-fluid"
                                style={{ maxHeight: '200px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src =
                                        'https://via.placeholder.com/300x200?text=Image+Error';
                                }}
                            />
                            <Form.Text className="text-success">
                                Image uploaded successfully
                            </Form.Text>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Add Product'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}