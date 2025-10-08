import React, { useState, useEffect } from 'react';
import { Form, Button, Badge, Card, Accordion, Spinner } from 'react-bootstrap';

export default function ProductFilters({ 
  filters, 
  onFilterChange, 
  totalProducts,
  filteredCount 
}) {
  const { minPrice, maxPrice, sortBy, categories: selectedCategories = [] } = filters;
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasActiveFilters = minPrice || maxPrice || selectedCategories.length > 0;

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products/active`);
        const products = await response.json();
        
        if (!isMounted) return;
        
        if (Array.isArray(products)) {
          const categoriesSet = new Set();
          products.forEach(product => {
            if (product.category) {
              categoriesSet.add(product.category);
            }
          });
          
          const categoriesArray = Array.from(categoriesSet).map(category => ({
            value: category,
            label: category,
            count: products.filter(p => p.category === category).length
          }));
          
          setAllCategories(categoriesArray);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setAllCategories([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handleCategoryChange = (categoryValue) => {
    const newCategories = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter(c => c !== categoryValue)
      : [...selectedCategories, categoryValue];
    
    onFilterChange({
      ...filters,
      categories: newCategories
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      categories: []
    });
  };

  return (
    <div className="h-100" style={{ marginTop: '165px' }}>
      <Accordion defaultActiveKey="0" alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h6 className="mb-0 fw-bold text-uppercase small">CATEGORIES</h6>
          </Accordion.Header>
          <Accordion.Body className="p-2">
            {isLoading ? (
              <div className="text-center py-2">
                <Spinner animation="border" size="sm" variant="primary" />
                <p className="text-muted small mt-1 mb-0">Loading categories...</p>
              </div>
            ) : (
              <div>
                {allCategories.map(cat => (
                  <Form.Check
                    key={cat.value}
                    type="checkbox"
                    id={`category-${cat.value}`}
                    label={
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span className="small">{cat.label}</span>
                        <Badge bg="outline-secondary" className="small">
                          {cat.count}
                        </Badge>
                      </div>
                    }
                    checked={selectedCategories.includes(cat.value)}
                    onChange={() => handleCategoryChange(cat.value)}
                    className="py-1 small"
                  />
                ))}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="1" alwaysOpen className="mt-3">
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <h6 className="mb-0 fw-bold text-uppercase small">PRICE</h6>
          </Accordion.Header>
          <Accordion.Body className="p-2">
            <div className="price-inputs mb-2">
              <div className="row g-1">
                <div className="col-5">
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    min="0"
                    size="sm"
                  />
                </div>
                <div className="col-2 d-flex align-items-center justify-content-center">
                  <span className="text-muted small">-</span>
                </div>
                <div className="col-5">
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    min="0"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <Form.Range
                min={0}
                max={100000}
                value={maxPrice || 100000}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>₱0</span>
                <span>₱100k</span>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="text-center">
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="w-100 small"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Card className="border-0 mt-3 mb-2">
        <Card.Body className="p-2">
          <h6 className="mb-2 fw-bold text-uppercase small">SORT BY</h6>
          <Form.Select 
            value={sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            size="sm" 
          >
            <option value="name">Best Match</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <Card className="border-0 mb-2">
        <Card.Body className="text-center p-2">
          <Badge bg="primary" className="px-2 py-1 mb-1 d-block small">
            {filteredCount} of {totalProducts}
          </Badge>
          <div className="small text-muted">Products</div>
        </Card.Body>
      </Card>
    </div>
  );
}