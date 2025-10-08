import { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/new-arrivals`)
      .then(res => res.json())
      .then(data => {
        console.log('New Arrivals Data:', data); 
        if (Array.isArray(data)) {
          const newArrivals = data.filter(product => product.isNewArrival === true);
          console.log('Filtered New Arrivals:', newArrivals); 
          setProducts(newArrivals);
        } else {
          setProducts([]);
        }
      })
      .catch(error => {
        console.error('Error fetching new arrivals:', error);
        setProducts([]);
      });
  }, []);

  const displayProducts = products.slice(0, 4);

  if (!products.length) return null;

  return (
    <Container className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">New Arrivals</h2>
        <Link to="/new-arrivals" className="btn btn-primary">View All</Link>
      </div>

      <Row className="g-4">
        {displayProducts.map(product => (
          <Col key={product._id} xs={12} sm={6} md={6} lg={3} className="d-flex">
            <ProductCard productProp={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}