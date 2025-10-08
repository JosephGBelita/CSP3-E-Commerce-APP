import { Carousel, Container } from "react-bootstrap";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AppCarousel() {
  const carouselItems = [
    { image: "/images/SilentHill.png" },
    { image: "/images/buildpc.png" },
    { image: "/images/2K26.png" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Container fluid className="px-0 mb-5">
      <Carousel
        fade
        interval={4000}
        controls={true}
        indicators={false}
        activeIndex={activeIndex}
        onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
        prevIcon={<FaChevronLeft className="text-dark" size={24} />}
        nextIcon={<FaChevronRight className="text-dark" size={24} />}
      >
        {carouselItems.map((item, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center position-relative">
              <img
                src={item.image}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              <div
                className="position-absolute d-flex"
                style={{
                  bottom: "10px", 
                  left: "50%",
                  transform: "translateX(-50%)",
                  gap: "10px",
                  zIndex: 50,
                }}
              >
                {carouselItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      width: idx === activeIndex ? "16px" : "12px",
                      height: idx === activeIndex ? "16px" : "12px",
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      backgroundColor:
                        idx === activeIndex ? "#fff" : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}