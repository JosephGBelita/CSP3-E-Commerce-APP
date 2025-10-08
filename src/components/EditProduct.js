import { useState, useEffect } from 'react';
import { Button, Modal, Form, Card } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function EditProduct({ product, fetchData }) {
  const notyf = new Notyf();

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category || 'Accessories');
  const [isNewArrival, setIsNewArrival] = useState(product.isNewArrival || false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const categories = [
    'Laptops & Computers',
    'Smartphones & Tablets', 
    'Gaming',
    'Audio',
    'Accessories'
  ];

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category || 'Accessories');
      setIsNewArrival(product.isNewArrival || false);
      setImageUrl(product.imageUrl || '');
    }
  }, [product]);

  const openEdit = () => setShowEdit(true);
  const closeEdit = () => setShowEdit(false);

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

  const editProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${product._id}/update`,
        {
          method: 'PATCH',
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
        }
      );

      const data = await response.json();

      if (data.success) {
        notyf.success('Product updated successfully');
        closeEdit();
        fetchData();
      } else {
        notyf.error(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update error:', error);
      notyf.error('Error updating product');
    }
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        className="w-100 edit-product-button"
        onClick={openEdit}
      >
        Edit
      </Button>

      <Modal show={showEdit} onHide={closeEdit} size="lg">
        <Form onSubmit={editProduct}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
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

            <Card>
              <Card.Header>Product Image</Card.Header>
              <Card.Body className="text-center">
                {imageUrl ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                    alt="Product preview"
                    className="img-fluid mb-3"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/300x200?text=Image+Error';
                    }}
                  />
                ) : (
                  <div
                    className="text-muted mb-3 d-flex align-items-center justify-content-center"
                    style={{ height: '200px' }}
                  >
                    No image selected
                  </div>
                )}

                <Form.Group>
                  <Form.Label>Upload New Image</Form.Label>
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
                  <div className="mt-2">
                    <Form.Text className="text-success">
                      Current image: {imageUrl}
                    </Form.Text>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}