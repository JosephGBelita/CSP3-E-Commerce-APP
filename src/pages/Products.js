import { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';
import ProductFilters from '../components/ProductFilters';

export default function Products() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        sortBy: 'name',
        categories: []
    });

    useEffect(() => { 
        const fetchData = () => {
            setLoading(true);
            const fetchUrl = user.isAdmin 
                ? `${process.env.REACT_APP_API_URL}/products/all` 
                : `${process.env.REACT_APP_API_URL}/products/active`;

            fetch(fetchUrl, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                    setFilteredProducts(data);
                } else if (data.products) {
                    setProducts(data.products);
                    setFilteredProducts(data.products);
                } else {
                    console.error('Unexpected response:', data);
                    setProducts([]);
                    setFilteredProducts([]);
                }
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setProducts([]);
                setFilteredProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
        };

        fetchData(); 
    }, [user.isAdmin]);

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

        if (filters.categories && filters.categories.length > 0) {
            filtered = filtered.filter(product => 
                filters.categories.includes(product.category)
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
            sortBy: 'name',
            categories: []
        });
    };

    if (loading) {
        return (
            <Container className="text-center py-5" style={{ marginTop: '130px' }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading products...</p>
            </Container>
        );
    }

    if (user.isAdmin) {
        const adminFetchData = () => {
            const fetchUrl = 'http://localhost:4000/products/all';
            fetch(fetchUrl, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data.products) {
                    setProducts(data.products);
                }
            })
            .catch(err => console.error('Error fetching products:', err));
        };

        return <AdminView productsData={products} fetchData={adminFetchData} />;
    }

    return (
        <Container fluid style={{ marginTop: '130px', paddingBottom: '100px' }}>
            <Row>
                <Col lg={3} className="mb-4 d-none d-lg-block">
                    <div className="fixed-filter-sidebar">
                        <ProductFilters 
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                            totalProducts={products.length}
                            filteredCount={filteredProducts.length}
                        />
                    </div>
                </Col>

                <Col xs={12} lg={9}>
                    <div className="text-center mb-5">
                        <h1 className="display-5 fw-bold text-dark mb-2">Our Products</h1>
                        <p className="text-muted mb-0">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
                        </p>
                        <hr className="w-25 mx-auto" />
                    </div>

                    <UserView productsData={filteredProducts} />

                    <div className="d-lg-none mt-5 border-top pt-4 mb-5">
                        <h4 className="fw-bold text-dark mb-3">Filter Products</h4>
                        <div className="bg-light p-3 rounded">
                            <ProductFilters 
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