import { useState, useEffect } from 'react';
import { Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import PriceOnlyFilter from '../components/PriceOnlyFilter';

const MobilePriceFilter = (props) => {
  return (
    <div className="mobile-price-filter">
      <PriceOnlyFilter {...props} />
    </div>
  );
};

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/new-arrivals`)
      .then(res => res.json())
      .then(data => {
        console.log('New Arrivals Page Data:', data);
        if (Array.isArray(data)) {
          const newArrivals = data.filter(product => product.isNewArrival === true);
          console.log('Filtered New Arrivals for Page:', newArrivals);
          setProducts(newArrivals);
          setFilteredProducts(newArrivals);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
      })
      .catch(() => {
        setProducts([]);
        setFilteredProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    const sortedProducts = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'newest':
          const dateA = a.createdOn ? new Date(a.createdOn) : new Date(0);
          const dateB = b.createdOn ? new Date(b.createdOn) : new Date(0);
          return dateB - dateA;
        default:
          return 0;
      }
    });

    setFilteredProducts(sortedProducts);
  }, [filters, products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      sortBy: 'name'
    });
  };

  if (loading) return (
    <Container className="text-center py-5" style={{ minHeight: '60vh', marginTop: '130px' }}>
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">Loading new arrivals...</p>
    </Container>
  );

  return (
    <Container fluid style={{ marginTop: '130px', paddingBottom: '50px' }}>
      <Row>
        <Col lg={3} className="mb-4 d-none d-lg-block">
          <PriceOnlyFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            totalProducts={products.length}
            filteredCount={filteredProducts.length}
          />
        </Col>

        <Col xs={12} lg={9}>
          <div className="text-center mb-4">
            <h1 className="display-5 fw-bold text-dark mb-2">New Arrivals</h1>
            <p className="text-muted mb-0">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
            </p>
            <hr className="w-25 mx-auto" />
          </div>

          {filteredProducts.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5 className="alert-heading">No New Arrivals Found</h5>
              <p>No new arrivals found with current filters.</p>
            </Alert>
          ) : (
            <Row className="g-4">
              {filteredProducts.map(product => (
                <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="d-flex">
                  <ProductCard productProp={product} />
                </Col>
              ))}
            </Row>
          )}

          <div className="d-lg-none mt-4 border-top pt-3">
            <h5 className="fw-bold text-dark mb-3">Filter Products</h5>
            <div className="bg-light p-3 rounded">
              <MobilePriceFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                totalProducts={products.length}
                filteredCount={filteredProducts.length}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}