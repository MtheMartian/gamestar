import React from 'react';
import {useRef, useEffect, useState} from 'react';
import '../css/homepage.css';
import '../css/general.css';
import xbox from '../images/xbox.png';
import playstation from '../images/ps.png';
import pc from '../images/pc.png';
import nintentdo from '../images/switch.png';
import Header from '../general-components/header';

function SearchRedirect(){
  return(
    <a href="/search">
      <img alt="search"></img>
    </a>
  );
}

function Carousel(){
  // Variables
  const carousel = useRef(null);
  const [titlesCarousel, setTitlesCarousel] = useState([]);

  // Get titles for carousel (1 to 3 months > current date)
  useEffect(()=>{
    let numberTitlesCarousel = 0;
    fetch("/home/carousels")
    .then(response => response.json())
    .then(data =>{
      console.log(data);
      numberTitlesCarousel = data.length;
      setTitlesCarousel(data);
    })
    .catch(err =>{
      console.log(err);
    });

    let carouselCounter = 0;
    setInterval(()=>{
      carousel.current.scrollLeft += carousel.current.clientWidth * 0.65;
      carouselCounter++;
      if(carousel.current.scrollLeft === carousel.current.clientWidth * (numberTitlesCarousel - 1)
          && carouselCounter === numberTitlesCarousel){
        carousel.current.scrollLeft = 0;
        carouselCounter = 0;
      }
    }, 9000);
  }, []);


  return(
    <div id="home-page-carousel" ref={carousel}>
      {titlesCarousel.map(title =>
        <div className="carousel-title-wrapper" key={title._id}>
          <img alt="title" src={title.imgURL} className="carousel-title-imagebg" />
          <div className="carousel-title-image-wrapper">
            <img alt="title" src={title.imgURL} className="carousel-title-image" />
            <div className="carousel-title-platforms">
              {title.platforms.includes("XSX") || title.platforms.includes("XSS") ? <img src={xbox} alt="Xbox"/> : null}
              {title.platforms.includes("PS4") || title.platforms.includes("PS5") ? <img src={playstation} alt="Xbox"/> : null}
              {title.platforms.includes("PC") ? <img src={pc} alt="Xbox"/> : null}
              {title.platforms.includes("Switch") ? <img src={nintentdo} alt="Xbox"/> : null}
            </div>
          </div>
          <iframe src={`${title.videoURL}?controls=0&playlist=${title.videoURL.slice(30, title.videoURL.length)}&loop=1`} className="carousel-title-trailer" 
            title="Title Trailer"/>
        </div>)}
        <button className="left" onClick={() =>{
            carousel.current.scrollLeft -= carousel.current.clientWidth * 0.65}}>
          &lt;
        </button>
        <button className="right" onClick={() =>{
              carousel.current.scrollLeft += carousel.current.clientWidth * 0.65}}>
          &gt;
        </button>
    </div>
  );
}

function HomePage(){
  return(
    <main id="home-page">
      <Header item={<SearchRedirect />}/>
      <Carousel />
    </main>
  );
}

export default HomePage;