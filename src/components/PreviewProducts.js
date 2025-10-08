import { Col, Card, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProducts({ breakPoint, data }) {
  const { _id, name, price, imageUrl } = data;

  return (
    <Col xs={12} md={breakPoint} className="mb-4 d-flex">
      <Card className="h-100 shadow-sm d-flex flex-column w-100 card-hover">
        <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '250px', overflow: 'hidden' }}>
          <Image
            src={imageUrl ? `${process.env.REACT_APP_API_URL}${imageUrl}` : 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={name}
            className="img-fluid h-100"
            style={{ objectFit: 'contain', padding: '10px' }}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=No+Image')}
          />
        </div>

        <Card.Body className="d-flex flex-column">
          <Card.Title className="text-center h6 fw-bold text-primary mb-2 text-truncate">{name}</Card.Title>

          <div className="mt-auto text-center">
            <div className="fw-bold text-dark mb-2">{`₱${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}</div>
            <Link to={`/products/${_id}`} className="btn btn-primary w-100">
              Details
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
