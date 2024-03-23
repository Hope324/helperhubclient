
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HomeCarousel.css';
import axios from 'axios';
import Loader from '../Loader';

const HomeCarousel = () => {
  const [carouselData,setCarouselData]=useState([]);
  const [loading,setLoading]=useState(true);
  const fetchCarouselData=async()=>{
    try {
      const {data}=await axios.get('/HomeCoverPage/CarouselData.json');
      setCarouselData(data);
    } catch (error) {
      console.error(error);
      
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchCarouselData();
  },[])
  if(loading) return <Loader/>
  return (
    <Carousel
      autoPlay
      infiniteLoop={true}
      showStatus={false}
      showThumbs={false}
      interval={3000}
      transitionTime={500}
      stopOnLastSlide={true}
    >
      {carouselData.map((item, index) => (
        <div key={index} className="carousel-slide">
          <img src={`/HomeCoverPage/CarouselImages/Image${index+1}/${item.imgNo}.jpg`} 
          alt={item.heading} style={{objectFit:'cover'}} />
          <div className="legend">
            <h3>{item.heading}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HomeCarousel;
