import React from 'react';
import {useRef, useEffect, useState, useMemo} from 'react';
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
  // Variables (Carousel)
  const carousel = useRef(null);
  const [titlesCarousel, setTitlesCarousel] = useState([]);

  // Variables (Carousel timer/Counter)
  const tilesNum = useMemo(()=> titlesCarousel.length, [titlesCarousel]);
  let tileCounter = useRef(0);
  const tileTimer = useRef(null);

  //Variables (Trailer Video)
  const trailer = useRef(null);

  // Display video if hovered over (PC) or tapped (Mobile).
  function videoSelected(event){
    console.log("Clicked on video!");
    clearInterval(tileTimer.current);
    event.currentTarget.style.height = "33rem";
  }

  // Carousel Navigation function
  function carouselNavFunction(){
    // Right
    if(tileCounter.current === tilesNum - 1){
      document.getElementById("right").classList.add("hidden");
    }
    else{
      document.getElementById("right").classList.remove("hidden");
    }

    // Left
    if(tileCounter.current === 0 || tileCounter.current === 3){
      document.getElementById("left").classList.add("hidden");
    }
    else{
      document.getElementById("left").classList.remove("hidden");
    }
  }

  // Set carousel timer after reset
  function setTileTimer(){
    tileTimer.current = setInterval(()=>{
      carousel.current.scrollLeft += carousel.current.clientWidth * 0.65;
      tileCounter.current++;
      carouselNavFunction();
      if(tileCounter.current === tilesNum){
        carousel.current.scrollLeft = 0;
        tileCounter.current = 0;
      }
    }, 9000);
  }

  // Go to next carousel tile, reset timer
  function nextTile(){
    clearInterval(tileTimer.current);
    carousel.current.scrollLeft += carousel.current.clientWidth * 0.65;
    tileCounter.current++;
    carouselNavFunction();
    setTileTimer();
    Array.from(document.getElementsByTagName("iframe")).forEach(element=>{
      element.style.cssText = null;
    });
    if(tileCounter.current > tilesNum){
      tileCounter.current = 0;
      carousel.current.scrollLeft = 0;
    }
  }

  // Go to previous carousel tile, reset timer
  function previousTile(){
    clearInterval(tileTimer.current);
    carousel.current.scrollLeft -= carousel.current.clientWidth * 0.65;
    tileCounter.current--;
    carouselNavFunction();
    setTileTimer();
    Array.from(document.getElementsByTagName("iframe")).forEach(element=>{
      element.style.cssText = null;
    });
    if(tileCounter.current < 0){
      tileCounter.current = 0;
      carousel.current.scrollLeft = 0;
    }
  }

  // Get titles for carousel (1 to 3 months > current date) and set carousel timer
  useEffect(()=>{
    fetch("/home/carousels")
    .then(response => response.json())
    .then(data =>{
      setTitlesCarousel(data);
    })
    .catch(err =>{
      console.log(err);
    });

    tileTimer.current = setInterval(()=>{
      carousel.current.scrollLeft += carousel.current.clientWidth * 0.65;
      tileCounter.current++;
      console.log(tileCounter);
      carouselNavFunction();
      if(tileCounter.current === tilesNum){
        carousel.current.scrollLeft = 0;
        tileCounter.current = 0;
      }
    }, 9000);

    return ()=>{
      clearInterval(tileTimer.current);
    }
  }, [tilesNum]);

  return(
    <div id="home-page-carousel" ref={carousel}>
      {titlesCarousel.map((title, index) =>
        <div className="carousel-title-wrapper" key={title._id} onTouchEnd={videoSelected}>
          <img alt="title" src={title.imgURL} className="carousel-title-imagebg" />
          <div className="carousel-title-image-wrapper" title={title.title}>
            <img alt="title" src={title.imgURL} className="carousel-title-image" />
            <div className="carousel-title-platforms">
              {title.platforms.includes("XSX") || title.platforms.includes("XSS") ? <img src={xbox} alt="Xbox"/> : null}
              {title.platforms.includes("PS4") || title.platforms.includes("PS5") ? <img src={playstation} alt="Xbox"/> : null}
              {title.platforms.includes("PC") ? <img src={pc} alt="Xbox"/> : null}
              {title.platforms.includes("Switch") ? <img src={nintentdo} alt="Xbox"/> : null}
            </div>
          </div>
          <iframe src={`${title.videoURL}?controls=0&enablejsapi=1&origin=http://localhost:3000/&autoplay=1&playlist=${title.videoURL.slice(30, title.videoURL.length)}&loop=1`} className="carousel-title-trailer" 
            title="Title Trailer" ref={trailer} onPointerOver={videoSelected} />
        </div>)}
        <button id="left" className="hidden" onClick={previousTile}>
          &lt;
        </button>
        <button id="right" onClick={nextTile}>
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