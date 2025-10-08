import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Accordion } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const location = useLocation();

    const categories = [
        { value: 'Smartphones & Tablets', label: 'Smartphones & Tablets' },
        { value: 'Laptops & Computers', label: 'Laptops & Computers' },
        { value: 'Gaming', label: 'Gaming' },
        { value: 'Audio', label: 'Audio' },
        { value: 'Accessories', label: 'Accessories' }
    ];

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
    }, [searchResults, minPrice, maxPrice, selectedCategories]);

    const applyFilters = () => {
        let filtered = [...searchResults];

        if (minPrice !== '' && minPrice !== null && !isNaN(minPrice)) {
            filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
        }
        if (maxPrice !== '' && maxPrice !== null && !isNaN(maxPrice)) {
            filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => selectedCategories.includes(product.category));
        }

        setFilteredResults(filtered);
    };

    const handleCategoryChange = (categoryValue) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryValue)) {
                return prev.filter(cat => cat !== categoryValue);
            } else {
                return [...prev, categoryValue];
            }
        });
    };

    const clearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedCategories([]);
    };

    const removeCategoryFilter = (categoryToRemove) => {
        setSelectedCategories(prev => prev.filter(cat => cat !== categoryToRemove));
    };

    const removePriceFilter = () => {
        setMinPrice('');
        setMaxPrice('');
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return '₱0';
        return `₱${parseFloat(price).toLocaleString()}`;
    };

    const getPriceRange = () => {
        if (searchResults.length === 0) return { min: 0, max: 100000 };
        const prices = searchResults.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

    const priceRange = getPriceRange();
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
                    <div className="sticky-top" style={{ top: '140px' }}>

                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white border-0 py-3">
                                <h6 className="mb-0 fw-bold text-uppercase small">CATEGORIES</h6>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="categories-list">
                                    {categories.map(category => (
                                        <div key={category.value} className="border-bottom">
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
                                                checked={selectedCategories.includes(category.value)}
                                                onChange={() => handleCategoryChange(category.value)}
                                                className="p-3 py-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white border-0 py-3">
                                <h6 className="mb-0 fw-bold text-uppercase small">PRICE</h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="price-inputs mb-3">
                                    <div className="row g-2">
                                        <div className="col">
                                            <Form.Control
                                                type="number"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                min="0"
                                                className="border small"
                                                size="sm"
                                            />
                                        </div>
                                        <div className="col-auto d-flex align-items-center">
                                            <span className="text-muted small">-</span>
                                        </div>
                                        <div className="col">
                                            <Form.Control
                                                type="number"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                min="0"
                                                className="border small"
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline-dark" 
                                    size="sm" 
                                    className="w-100"
                                    onClick={() => {
                                        if (minPrice || maxPrice) {
                                            applyFilters();
                                        }
                                    }}
                                >
                                    APPLY PRICE
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                <Col lg={9}>
                    {(minPrice || maxPrice || selectedCategories.length > 0) && (
                        <div className="mb-4 p-3 bg-light rounded">
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="small fw-bold text-muted">ACTIVE FILTERS:</span>
                                
                                {selectedCategories.map(category => (
                                    <Badge key={category} bg="white" text="dark" className="border px-3 py-2 d-flex align-items-center">
                                        <span className="small">{category}</span>
                                        <Button 
                                            variant="link" 
                                            className="p-0 ms-2 text-danger"
                                            onClick={() => removeCategoryFilter(category)}
                                            style={{ fontSize: '10px' }}
                                        >
                                            ✕
                                        </Button>
                                    </Badge>
                                ))}
                                
                                {(minPrice || maxPrice) && (
                                    <Badge bg="white" text="dark" className="border px-3 py-2 d-flex align-items-center">
                                        <span className="small">
                                            {minPrice ? `${formatPrice(minPrice)}` : 'Any'} - {maxPrice ? `${formatPrice(maxPrice)}` : 'Any'}
                                        </span>
                                        <Button 
                                            variant="link" 
                                            className="p-0 ms-2 text-danger"
                                            onClick={removePriceFilter}
                                            style={{ fontSize: '10px' }}
                                        >
                                            ✕
                                        </Button>
                                    </Badge>
                                )}

                                {(minPrice || maxPrice || selectedCategories.length > 0) && (
                                    <Button 
                                        variant="link" 
                                        className="p-0 text-decoration-none text-primary fw-bold ms-2"
                                        onClick={clearFilters}
                                    >
                                        CLEAR ALL
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">Search Results for "{searchQuery}"</h2>
                            <p className="text-muted mb-0 small">
                                Showing {filteredResults.length} of {searchResults.length} products
                            </p>
                        </div>
                        
                        <div className="d-flex align-items-center">
                            <span className="text-muted small me-2">SORT BY:</span>
                            <Form.Select size="sm" className="border-0 bg-light" style={{ width: 'auto' }}>
                                <option>Best Match</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest Arrivals</option>
                            </Form.Select>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="warning" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {filteredResults.length === 0 && !error ? (
                        <Alert variant="info" className="text-center">
                            <h5 className="alert-heading">No Products Found</h5>
                            <p className="mb-3">No products found matching "{searchQuery}" with current filters.</p>
                            {(minPrice || maxPrice || selectedCategories.length > 0) && (
                                <Button 
                                    variant="outline-primary" 
                                    onClick={clearFilters}
                                    size="sm"
                                >
                                    Clear filters to see all results
                                </Button>
                            )}
                        </Alert>
                    ) : (
                        <>
                            <Row className="g-3">
                                {filteredResults.map(product => (
                                    <Col key={product._id} xs={6} sm={4} md={3} className="d-flex">
                                        <ProductCard productProp={product} />
                                    </Col>
                                ))}
                            </Row>
                            
                            {filteredResults.length > 0 && (
                                <div className="text-center mt-4 pt-3 border-top">
                                    <p className="text-muted small">
                                        Showing {filteredResults.length} products
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}