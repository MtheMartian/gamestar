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

function CarouselNavigation({carousel, tileTimer, tileCounter, tilesNum,
    content, className, id, setTileTimer, tileNavigationFill, carouselNavFunction}){
  // Go to next carousel tile, reset timer
  function nextTile(){
    clearInterval(tileTimer.current);
    carousel.current.scrollLeft += carousel.current.clientWidth * 0.65;
    tileCounter.current++;
    carouselNavFunction();
    setTileTimer();
    tileNavigationFill();
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
    tileNavigationFill();
    Array.from(document.getElementsByTagName("iframe")).forEach(element=>{
      element.style.cssText = null;
    });
    if(tileCounter.current < 0){
      tileCounter.current = 0;
      carousel.current.scrollLeft = 0;
    }
  }

  return(
    <button id={id} className={className} onClick={id === "right" ? nextTile : previousTile}>
          {content}
    </button>
  )
}

function Carousel(){ 
  // Variables (Carousel)
  const carousel = useRef(null);
  const [titlesCarousel, setTitlesCarousel] = useState([]);

  // Variables (Carousel timer/Counter)
  const tilesNum = useMemo(()=> titlesCarousel.length, [titlesCarousel]);
  let tileCounter = useRef(0);
  const tileTimer = useRef(null);

  // Variables (Trailer Video)
  const trailer = useRef(null);

  // Display video if hovered over (PC) or tapped (Mobile).
  function videoSelected(event){
    console.log("Clicked on video!");
    clearInterval(tileTimer.current);
    event.currentTarget.style.height = "33rem";
  }

  // Variables (Carousel Navigation)
  const [tileNav, setTileNav] = useState([]);

  // Fill background of tile navigation buttons based on tile counter
  function tileNavigationFill(){
   const tileNavs = Array.from(document.getElementsByClassName("tile-nav-button"));
   tileNavs.forEach(element=>{
    if(element.id === `tile${tileCounter.current.toString()}`){
      element.style.background = "rgba(240, 248, 255, 0.9)";
    }
    else{
      element.style.background = null;
    }
   });
  }

  // Hide Carousel Navigation buttons
  function carouselNavFunction(){
    // Right
    if(tileCounter.current === tilesNum - 1){
      document.getElementById("right").classList.add("hidden");
    }
    else{
      document.getElementById("right").classList.remove("hidden");
    }

    // Left
    if(tileCounter.current === 0 || tileCounter.current === tilesNum){
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
      tileNavigationFill();
    }, 9000);
  }

  // Append tile nav buttons to page
  useEffect(()=>{
    function tileNavigation(){
      let jsxElements = [];
      for(let i = 0; i < tilesNum; i++){
        jsxElements.push(
          <button key={i} id={`tile${i}`}className="tile-nav-button"
            onClick={()=>{
              carousel.current.scrollLeft = carousel.current.clientWidth * i;
              tileCounter.current = i;
              tileNavigationFill();
              carouselNavFunction();
              clearInterval(tileTimer.current);
              setTileTimer();
            }}>
          </button>
        )
      }
      return jsxElements;
    }
    setTileNav(tileNavigation);
    setTimeout(tileNavigationFill, 10);
  }, [tilesNum])

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
      tileNavigationFill();
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
          <div className="carousel-title-summary-wrapper">
            <p className="carousel-title-summary">
              {title.summary}
            </p>
          </div>
        </div>)}
        <CarouselNavigation content={"<"} className={"hidden"} id={"left"}
          carouselNavFunction={carouselNavFunction} tileNavigationFill={tileNavigationFill}
          tileCounter={tileCounter} tileTimer={tileTimer} tilesNum={tilesNum}
          carousel={carousel} setTileTimer={setTileTimer}/>
        <CarouselNavigation content={">"} className={""} id={"right"} 
          carouselNavFunction={carouselNavFunction} tileNavigationFill={tileNavigationFill}
          tileCounter={tileCounter} tileTimer={tileTimer} tilesNum={tilesNum}
          carousel={carousel} setTileTimer={setTileTimer}/>
        <div id="tiles-navigation">
          {tileNav}
        </div>
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