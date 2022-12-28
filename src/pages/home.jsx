import React from 'react';
import {useRef, useEffect, useState, useMemo, useCallback} from 'react';
import '../css/homepage.css';
import '../css/general.css';
import '../css/carousel.css';
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

// Carousel
function CarouselNavigation({carousel, tileTimer, tileCounter, tilesNum,
    content, className, setTileTimer, tileNavigationFill, carouselNavFunction}){
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
    <button className={className} onClick={content === ">" ? nextTile : previousTile}>
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
      element.style.background = "rgba(44, 0, 58, 1)";
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
      Array.from(document.getElementsByClassName("right")).forEach(element=>{
        element.classList.add("hidden");
      });
    }
    else{
      Array.from(document.getElementsByClassName("right")).forEach(element=>{
        element.classList.remove("hidden");
      });
    }

    // Left
    if(tileCounter.current === 0 || tileCounter.current === tilesNum){
      Array.from(document.getElementsByClassName("left")).forEach(element=>{
        element.classList.add("hidden");
      });
    }
    else{
      Array.from(document.getElementsByClassName("left")).forEach(element=>{
        element.classList.remove("hidden");
      });
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
        <div className="carousel-title-wrapper" key={title._id} onClick={document.querySelector('body').clientWidth >= 1200 ? videoSelected : null}>
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
          {document.querySelector('body').clientWidth >= 1200 ? 
            <iframe src={`${title.videoURL}?controls=0&enablejsapi=1&origin=http://localhost:3000/&autoplay=1&playlist=${title.videoURL.slice(30, title.videoURL.length)}&loop=1`} className="carousel-title-trailer" 
            title="Title Trailer" ref={trailer} onPointerOver={videoSelected} /> : null
          }
          <div className="carousel-title-summary-wrapper">
            <p className="carousel-title-summary">
              {title.summary}
            </p>
          </div>
          <CarouselNavigation content={"<"} className={"hidden left"}
          carouselNavFunction={carouselNavFunction} tileNavigationFill={tileNavigationFill}
          tileCounter={tileCounter} tileTimer={tileTimer} tilesNum={tilesNum}
          carousel={carousel} setTileTimer={setTileTimer}/>
          <CarouselNavigation content={">"} className={"right"}
          carouselNavFunction={carouselNavFunction} tileNavigationFill={tileNavigationFill}
          tileCounter={tileCounter} tileTimer={tileTimer} tilesNum={tilesNum}
          carousel={carousel} setTileTimer={setTileTimer}/>
          <div className="tiles-navigation">
            {tileNav}
          </div>
        </div>)}
    </div>
  );
}

// Navigation button for categories
function CategoryNavigation({content, className}){
  function leftNav(event){
    const relative = event.currentTarget.parentElement.children.item(1);
    const parent = event.currentTarget.parentElement;
    relative.scrollLeft -= 300;
    if(relative.scrollLeft <= relative.clientWidth * 0.1){
      parent.children.item(2).classList.add("hidden");
      parent.children.item(3).classList.remove("hidden");
    }
    else{
      parent.children.item(3).classList.remove("hidden");
    }
  }

  function rightNav(event){
    const relative = event.currentTarget.parentElement.children.item(1);
    const parent = event.currentTarget.parentElement;
    relative.scrollLeft += 300;
    if(relative.scrollLeft > 0){
      parent.children.item(2).classList.remove("hidden");
    }
    if(relative.scrollLeft >= relative.scrollWidth - relative.clientWidth){
      parent.children.item(3).classList.add("hidden");
    }
  }

  return(
    <button className={className} onClick={content === "<" ? leftNav : rightNav}>
      {content}
    </button>
  );
}

// All title categories
function Categories(){
  // Variables
  const genres = useRef([]);
  const [titles, setTitles] = useState([]);
  const allTitles = useMemo(()=> titles, [titles]);

  // Put titles in the correct category
  const getGenres = useCallback(()=>{
    if(typeof allTitles !== "undefined"){
      allTitles.forEach((title, index) =>{
        for(let i = 0; i < title.tags.length; i++){
          if(!genres.current.includes(title.tags[i])){
            genres.current.push(title.tags[i]);
          }
        }
      });  
    }
  }, [allTitles])

  getGenres();

  // Check if device is touch, if so enable scroll.
  function ifTouch(){
    const allCategories = Array.from(document.getElementsByClassName("home-page-genre"));
    allCategories.forEach(element =>{
      element.style.overflowX = "scroll";
    })
  }

  // Get the titles
  useEffect(()=>{
    fetch("/admintools.gamesportal/gettitles")
    .then(response => response.json())
    .then(data =>{
      setTitles(prev => prev = data);
    })
    .catch(err=>{
      console.log(err);
    })
  }, [])

  // Hide category navigations if element can't be scrolled.
  useEffect(()=>{
    const allCategories = Array.from(document.getElementsByClassName("home-page-genre"));
    allCategories.forEach(element =>{
      if(element.scrollWidth > element.offsetWidth){
        element.parentElement.children.item(3).classList.remove("hidden");
      }
    });
  }, [allTitles])

  return(
    <div id="home-page-categories">
      {genres.current.map((genre, index) =>
        <div key={`genre${index}`} className="home-page-genre-container">
          <h2 className="home-page-section-title">{genre}</h2>
          <div className="home-page-genre" onTouchStart={ifTouch}>
            {allTitles.map(title =>
            title.tags.includes(genre) ? 
            <div key={title._id} className="genre-titles" title={title.title}>
              <img className="genre-title-image" src={title.imgURL} alt="Title" />
              {/* <p className="genre-title-title">{title.title}</p> */}
            </div> : null)}
          </div>
          <CategoryNavigation className={"category-navigation category-left hidden"} content={"<"} />
          <CategoryNavigation className={"category-navigation category-right hidden"} content={">"} />
        </ div>)}
    </div>
  );
}

// Home Page
function HomePage(){
  return(
    <main id="home-page-bg">
      <div id="home-page">
      <Header item={<SearchRedirect />}/>
      <Carousel />
      <Categories />
      </div>
    </main>
  );
}

export default HomePage;