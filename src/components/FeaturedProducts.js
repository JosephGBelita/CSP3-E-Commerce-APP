import { useState, useEffect } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/products/active`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const selected = [];
          const usedIndexes = new Set();
          while (selected.length < Math.min(6, data.length)) {
            const idx = Math.floor(Math.random() * data.length);
            if (!usedIndexes.has(idx)) {
              usedIndexes.add(idx);
              selected.push(data[idx]);
            }
          }
          setProducts(selected);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container className="mb-5 text-center py-4">
        <h2 className="fw-bold text-dark mb-4">Featured Products</h2>
        <p className="text-muted">Loading featured products...</p>
      </Container>
    );
  }

  return (
    <Container className="mb-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-3">Featured Products</h2>
        <p className="text-muted lead">Handpicked selection of our best products</p>
        <hr className="w-25 mx-auto border-secondary" />
      </div>

      <Row className="g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={4}>
              <ProductCard productProp={product} />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center">
            <p className="text-muted py-4">No featured products available at the moment.</p>
          </Col>
        )}
      </Row>

      {products.length > 0 && (
        <div className="text-center mt-4">
          <Button variant="outline-primary" size="lg" onClick={() => navigate('/products')}>
            View All Products
          </Button>
        </div>
      )}
    </Container>
  );
}
