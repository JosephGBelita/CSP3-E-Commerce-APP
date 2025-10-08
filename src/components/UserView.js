import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';

export default function UserView({ productsData }) {
    const [activeProducts, setActiveProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        
        if (Array.isArray(productsData)) {
            const filteredProducts = productsData.filter(product => product.isActive);
            setActiveProducts(filteredProducts);
        } else {
            setActiveProducts([]);
        }
        
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [productsData]);

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading products...</p>
            </div>
        );
    }

    return (
        <>
            {activeProducts.length === 0 ? (
                <Alert variant="info" className="text-center">
                    <h4 className="alert-heading">No Products Found</h4>
                    <p className="mb-0">No products available at the moment.</p>
                </Alert>
            ) : (
                <Row className="g-4 product-grid-fixed">
                    {activeProducts.map(product => (
                        <Col xs={12} sm={6} md={4} lg={3} key={product._id} className="d-flex">
                            <ProductCard productProp={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
}