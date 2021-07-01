import { Carousel } from "react-bootstrap";
import "../../css/Carousel.css";
// import { banner2, banner } from "../../images";

const MenuCarousel = () => {
  return (
    <>
      <Carousel id="carousel">
        <Carousel.Item>
          {/* <img
            className="d-block w-100"
            id="banner-image"
            src={banner}
            alt="Daily Specials"
          />
          <Carousel.Caption>
            <h1 id="banner-text">HK Garden</h1>
          </Carousel.Caption> */}

          <h1 id="banner-text">
            HK Garden <br />
            花園茶室
          </h1>
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default MenuCarousel;
