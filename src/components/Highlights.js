import { Row, Col, Card } from 'react-bootstrap';
import { FaShieldAlt, FaShippingFast, FaAward, FaLock } from 'react-icons/fa';

export default function Highlights() {
  const highlights = [
    { icon: <FaShieldAlt size={45} />, title: '100% Authentic Products', description: 'All items are brand new, original, and come with official warranty.', color: 'text-success' },
    { icon: <FaShippingFast size={45} />, title: 'Fast Shipping Nationwide', description: 'Ships within 24 hours! Express and Same-Day Delivery available.', color: 'text-primary' },
    { icon: <FaAward size={45} />, title: 'Loyalty Rewards Program', description: 'Earn points on every purchase! Redeem exclusive rewards.', color: 'text-warning' },
    { icon: <FaLock size={45} />, title: '100% Safe & Secure', description: 'All transactions are fully encrypted with state-of-the-art security.', color: 'text-info' },
  ];

  return (
    <section className="py-5 bg-light mb-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">
            Your Trusted <span className="text-primary">ZuittShop</span>
          </h2>
          <p className="lead text-muted">Premium electronics, guaranteed authenticity, exceptional service</p>
        </div>

        <Row className="g-4">
          {highlights.map((item, index) => (
            <Col lg={3} md={6} sm={12} key={index}>
              <Card className={`h-100 shadow-sm border-0 text-center p-4 card-hover`}>
                <div className={`mb-3 ${item.color}`}>{item.icon}</div>
                <h5 className="fw-bold text-dark mb-3">{item.title}</h5>
                <p className="text-muted mb-0">{item.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
