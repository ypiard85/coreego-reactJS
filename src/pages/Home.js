import { Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "../styles/swiper.css";

//import des images
import Img1 from "../images/homeCarousel/image.jpg";
import JejuImg from "../images/homeCarousel/Jeju-Cascade-Cheonjeyeon.jpg";
import SeoulImg from "../images/homeCarousel/Seoul.jpg";

function SwiperHome() {

    const images = [Img1, , JejuImg, SeoulImg];

  return (
    <Swiper navigation={false} className="homeSwiper">
      {images.map((i) => {
        return (
          <SwiperSlide key={i} >
            <img src={i} alt={i} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

function Home() {
  return (
    <div>
      <SwiperHome />
      <Container>main</Container>
    </div>
  );
}

export default Home;
