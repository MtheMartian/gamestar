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

  // Variables (Carousel Tile navigation)
  const [prevBtn, setPrevBtn] = useState(null);
  const [nextBtn, setNextBtn] = useState(null);

  // Variables (Carousel timer/Counter)
  const tilesNum = useMemo(()=> titlesCarousel.length, [titlesCarousel]);
  let tileCounter = useRef(0);
  const tileTimer = useRef(null);

  //Variables (Trailer Video)
  const trailer = useRef(null);

  //
  function videoSelected(){
    console.log("Clicked on video!");
    clearInterval(tileTimer.current);
  }

  // Set carousel timer after reset
  function setTileTimer(){
    tileTimer.current = setInterval(()=>{
      carousel.current.scrollLeft += carousel.current.clientWidth * 0.65;
      tileCounter.current++;
      console.log(tileCounter);
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
    console.log(tileCounter.current);
    setTileTimer();
    if(tileCounter.current > tilesNum){
      tileCounter.current = 0;
      carousel.current.scrollLeft = 0;
      console.log(tileCounter.current);
    }
  }

  // Go to previous carousel tile, reset timer
  function previousTile(){
    clearInterval(tileTimer.current);
    carousel.current.scrollLeft -= carousel.current.clientWidth * 0.65;
    tileCounter.current--;
    console.log(tileCounter.current);
    setTileTimer();
    if(tileCounter.current < 0){
      tileCounter.current = 0;
      carousel.current.scrollLeft = 0;
      console.log(tileCounter.current);
    }
  }

  // Get titles for carousel (1 to 3 months > current date) and set carousel timer
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

    tileTimer.current = setInterval(()=>{
      carousel.current.scrollLeft += carousel.current.clientWidth * 0.65;
      tileCounter.current++;
      console.log(tileCounter);
      if(tileCounter.current === tilesNum){
        carousel.current.scrollLeft = 0;
        tileCounter.current = 0;
      }
    }, 9000);

    return ()=>{
      clearInterval(tileTimer.current);
      console.log("lol");
    }
  }, [tilesNum]);


  return(
    <div id="home-page-carousel" ref={carousel} onClick={(e)=>{console.log(e)}}>
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
          <iframe src={`${title.videoURL}?controls=0&enablejsapi=1&autoplay=1&playlist=${title.videoURL.slice(30, title.videoURL.length)}&loop=1`} className="carousel-title-trailer" 
            title="Title Trailer" ref={trailer} onMouseEnter={videoSelected} onTouchMove={videoSelected}/>
        </div>)}
        <button className="left" onClick={previousTile}>
          &lt;
        </button>
        <button className="right" onClick={nextTile}>
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