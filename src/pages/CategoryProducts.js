import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import PriceOnlyFilter from '../components/ProductFilters';

export default function CategoryProducts() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        sortBy: 'name'
    });
    const { category } = useParams();

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/products/active`);
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const categoryProducts = data.filter(product => 
                        product.category === category
                    );
                    setProducts(categoryProducts);
                    setFilteredProducts(categoryProducts);
                } else {
                    setProducts([]);
                    setFilteredProducts([]);
                }
            } catch (error) {
                console.error('Category fetch error:', error);
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [category]);

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

    if (loading) {
        return (
            <Container className="text-center py-5" style={{ marginTop: '130px', minHeight: '60vh' }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading {category} products...</p>
            </Container>
        );
    }

    return (
        <Container fluid style={{ marginTop: '130px', paddingBottom: '100px' }}> 
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
                    <div className="text-center mb-5">
                        <h1 className="display-5 fw-bold text-dark mb-2 text-capitalize">{category}</h1>
                        <p className="text-muted mb-0">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
                        </p>
                        <hr className="w-25 mx-auto" />
                    </div>

                    {filteredProducts.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            <h5 className="alert-heading">No Products Found</h5>
                            <p>No products found in {category} with current filters.</p>
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

                    <div className="d-lg-none mt-5 border-top pt-4 mb-5">
                        <h4 className="fw-bold text-dark mb-3">Filter Products</h4>
                        <div className="bg-light p-3 rounded">
                            <PriceOnlyFilter 
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