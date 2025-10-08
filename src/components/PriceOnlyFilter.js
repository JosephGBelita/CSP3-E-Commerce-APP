import React from 'react';
import { Form, Button, Badge, Card, Accordion} from 'react-bootstrap';

export default function PriceOnlyFilter({ 
  filters, 
  onFilterChange, 
  totalProducts,
  filteredCount 
}) {
  const { minPrice, maxPrice, sortBy } = filters;
  const hasActiveFilters = minPrice || maxPrice;

  const clearAllFilters = () => {
    onFilterChange({
      minPrice: '',
      maxPrice: '',
      sortBy: 'name'
    });
  };

  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="h-100" style={{ marginTop: '165px' }}>
      <Accordion defaultActiveKey="0" alwaysOpen>
        <Accordion.Item eventKey="0">
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