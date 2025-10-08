import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {
  const { _id, name, price, imageUrl } = productProp;
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) =>
    `₱${price?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;

  return (
    <Card className="h-100 shadow-sm border-0 d-flex flex-column product-card">
      <div 
        className="bg-light d-flex align-items-center justify-content-center" 
        style={{ 
          height: '200px', 
          width: '100%',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <Image
          src={
            imageError || !imageUrl
              ? 'https://via.placeholder.com/300x200/ffffff/cccccc?text=No+Image'
              : `${process.env.REACT_APP_API_URL}${imageUrl}`
          }
          onError={() => setImageError(true)}
          alt={name}
          className="img-fluid"
          style={{ 
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      <Card.Body className="d-flex flex-column flex-grow-1 p-3 product-card-content">
        <div className="mb-2" style={{ minHeight: '72px', display: 'flex', alignItems: 'flex-start' }}>
          <Card.Title className="h6 text-dark mb-0 w-100">
            <Link to={`/products/${_id}`} className="text-decoration-none text-dark">
              <div className="product-name-fixed" style={{ 
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {name}
              </div>
            </Link>
          </Card.Title>
        </div>

        <div className="mt-auto">
          <div className="mb-3">
            <span className="h6 fw-bold text-primary">{formatPrice(price)}</span>
          </div>

          <div className="product-card-button">
            <Link to={`/products/${_id}`} className="btn btn-outline-primary w-100 py-2">
              View Details
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

ProductCard.propTypes = {
  productProp: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
    imageUrl: PropTypes.string,
  }).isRequired,
};