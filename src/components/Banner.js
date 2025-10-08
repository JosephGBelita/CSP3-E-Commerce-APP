import { Container, Button, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion"; 
import { useNavigate } from "react-router-dom";

export default function Banner({ data }) {
  const navigate = useNavigate();
  const bannerImage = "/images/hero.jpg";

  return (
    <Container
      fluid
      className="hero-section d-flex align-items-center justify-content-center text-white position-relative overflow-hidden mb-5"
      style={{
        minHeight: "85vh",
        backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.75), rgba(0,0,0,0.6)), url('${bannerImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8} md={10}>
            <motion.div
              className="hero-content position-relative z-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="display-4 fw-bold mb-4 text-shadow-sm">
                {data?.title || "Power Your Tech Lifestyle"}
              </h1>

              <p className="lead mb-5 fs-5 text-light">
                {data?.content ||
                  "Discover premium gadgets, cutting-edge laptops, and the latest tech trends — all in one trusted destination."}
              </p>

              <div className="hero-buttons d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-5 py-3 fw-bold btn-gradient shadow"
                  onClick={() => navigate(data?.destination || "/products")}
                >
                  {data?.buttonLabel || "Shop Now"}
                </Button>

                <Button
                  variant="outline-light"
                  size="lg"
                  className="px-5 py-3 fw-bold"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          zIndex: 1,
        }}
      ></div>
    </Container>
  );
}
