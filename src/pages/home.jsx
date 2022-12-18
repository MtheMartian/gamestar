import React from 'react';
import {useRef, useEffect, useState} from 'react';
import '../css/homepage.css';
import '../css/general.css';
import Header from '../general-components/header';

function SearchRedirect(){
  return(
    <a href="/search">
      <img alt="search"></img>
    </a>
  );
}

function Carousel(){
  const carousel = useRef(null);
  const [titlesCarousel, setTitlesCarousel] = useState([]);

  useEffect(()=>{
    fetch("/home/carousels")
    .then(response => response.json())
    .then(data =>{
      console.log(data);
      setTitlesCarousel(data);
    })
    .catch(err =>{
      console.log(err);
    });
  }, [])

  return(
    <div id="home-page-carousel" ref={carousel}>
      {titlesCarousel.map(title =>
        <div className="carousel-title-wrapper" key={title._id}>
          <img alt="title" src={title.imgURL} className="carousel-title-imagebg" />
          <img alt="title" src={title.imgURL} className="carousel-title-image" />
          <iframe src={`${title.videoURL}?controls=0&playlist=${title.videoURL.slice(30, title.videoURL.length)}&loop=1`} className="carousel-title-trailer" 
            title="Title Trailer"/>
        </div>)}
        <button className="left" onClick={() =>{
            carousel.current.scrollLeft -= carousel.current.clientWidth}}>
          Left
        </button>
        <button className="right" onClick={() =>{
              carousel.current.scrollLeft += carousel.current.clientWidth}}>
          Right
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