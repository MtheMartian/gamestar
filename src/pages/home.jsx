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
          <img alt="title" src={title.imgURL} className="carousel-title-image" />
          <button className="left" onClick={() =>{
            carousel.current.scrollLeft -= carousel.current.clientWidth}}>
              Left
            </button>
            <button className="right" onClick={() =>{
              carousel.current.scrollLeft += carousel.current.clientWidth}}>
              Right
            </button>
        </div>)}
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