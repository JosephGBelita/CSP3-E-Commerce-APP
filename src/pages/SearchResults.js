import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Accordion } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        sortBy: 'name',
        categories: []
    });
    const location = useLocation();

    const categories = [
        { value: 'Smartphones & Tablets', label: 'Smartphones & Tablets' },
        { value: 'Laptops & Computers', label: 'Laptops & Computers' },
        { value: 'Gaming', label: 'Gaming' },
        { value: 'Audio', label: 'Audio' },
        { value: 'Accessories', label: 'Accessories' }
    ];

    const applyFilters = useCallback(() => {
        let filtered = [...searchResults];

        if (filters.minPrice) {
            filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
        }

        if (filters.categories.length > 0) {
            filtered = filtered.filter(product => filters.categories.includes(product.category));
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

        setFilteredResults(sortedProducts);
    }, [searchResults, filters]);

    useEffect(() => {
        const searchProducts = async () => {
            setLoading(true);
            setError('');
            const params = new URLSearchParams(location.search);
            const query = params.get('query');

            if (!query) {
                setSearchResults([]);
                setFilteredResults([]);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search-by-name`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productName: query })
                });

                const data = await response.json();
                
                if (data.success) {
                    setSearchResults(data.data || []);
                    setFilteredResults(data.data || []);
                } else {
                    setSearchResults([]);
                    setFilteredResults([]);
                    setError(data.message || 'No products found');
                }
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
                setFilteredResults([]);
                setError('Failed to search products');
            } finally {
                setLoading(false);
            }
        };

        searchProducts();
    }, [location.search]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleInputChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCategoryChange = (categoryValue) => {
        const newCategories = filters.categories.includes(categoryValue)
            ? filters.categories.filter(c => c !== categoryValue)
            : [...filters.categories, categoryValue];
        
        handleFilterChange({
            ...filters,
            categories: newCategories
        });
    };

    const clearAllFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            sortBy: 'name',
            categories: []
        });
    };

    const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.categories.length > 0;

    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('query');

    if (loading) {
        return (
            <Container className="text-center py-5" style={{ marginTop: '100px' }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Searching for "{searchQuery}"...</p>
            </Container>
        );
    }

    return (
        <Container fluid style={{ marginTop: '120px', paddingBottom: '50px' }}>
            <Row>
                <Col lg={3} className="mb-4">
                    <div className="h-100" style={{ marginTop: '60px' }}>
                        <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
                            
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <h6 className="mb-0 fw-bold text-uppercase small">CATEGORIES</h6>
                                </Accordion.Header>
                                <Accordion.Body className="p-2">
                                    {categories.map(category => (
                                        <div key={category.value} className="mb-1">
                                            <Form.Check
                                                type="checkbox"
                                                id={`category-${category.value}`}
                                                label={
                                                    <div className="d-flex justify-content-between align-items-center w-100">
                                                        <span className="small">{category.label}</span>
                                                        <Badge bg="light" text="dark" className="small">
                                                            {searchResults.filter(p => p.category === category.value).length}
                                                        </Badge>
                                                    </div>
                                                }
                                                checked={filters.categories.includes(category.value)}
                                                onChange={() => handleCategoryChange(category.value)}
                                                className="py-0 small"
                                            />
                                        </div>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>

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
                                                    value={filters.minPrice}
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
                                                    value={filters.maxPrice}
                                                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                                                    min="0"
                                                    size="sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <Form.Range
                                            min={0}
                                            max={100000}
                                            value={filters.maxPrice || 100000}
                                            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                                        />
                                        <div className="d-flex justify-content-between small text-muted">
                                            <span>₱0</span>
                                            <span>₱100k</span>
                                        </div>
                                    </div>

                                    {hasActiveFilters && (
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            className="w-100 mt-2 small"
                                            onClick={clearAllFilters}
                                        >
                                            Clear All Filters
                                        </Button>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>

                        </Accordion>

                        <Card className="border-0 mt-3 mb-2">
                            <Card.Body className="p-2">
                                <h6 className="mb-2 fw-bold text-uppercase small">SORT BY</h6>
                                <Form.Select 
                                    value={filters.sortBy}
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
                                    {filteredResults.length} of {searchResults.length}
                                </Badge>
                                <div className="small text-muted">Products</div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                <Col lg={9}>
                    <div className="mb-4">
                        <h1 className="fw-bold text-dark mb-2">Search Results for "{searchQuery}"</h1>
                        <p className="text-muted mb-0">
                            Showing {filteredResults.length} of {searchResults.length} products
                        </p>
                    </div>

                    {error && (
                        <Alert variant="warning" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {searchResults.length === 0 && !error ? (
                        <Alert variant="info" className="text-center">
                            <h5 className="alert-heading">No Products Found</h5>
                            <p className="mb-3">No products found matching "{searchQuery}"</p>
                        </Alert>
                    ) : filteredResults.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            <h5 className="alert-heading">No Products Match Filters</h5>
                            <p className="mb-3">No products found matching your current filters.</p>
                        </Alert>
                    ) : (
                        <Row className="g-4">
                            {filteredResults.map(product => (
                                <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="d-flex">
                                    <ProductCard productProp={product} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
}