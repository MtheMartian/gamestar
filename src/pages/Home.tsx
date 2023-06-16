import React from 'react';
import {useRef, useEffect, useState, useMemo, useCallback} from 'react';
import { Link } from 'react-router-dom';
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
    <a href="/search" id="search-section-wrapper">
      <span>Search</span>
      <span className="material-symbols-outlined" id="search-icon">
        search
      </span>
    </a>
  );
}

// Carousel
type CarouselNavigationProps = {
  carousel: React.MutableRefObject<HTMLDivElement | null>,
  tileTimer: React.MutableRefObject<NodeJS.Timer | null>,
  tileCounter: React.MutableRefObject<number>,
  tilesNum: number,
  content: string,
  className: string,
  setTileTimer: Function,
  tileNavigationFill: Function,
  carouselNavFunction: Function,
}

function CarouselNavigation({carousel, tileTimer, tileCounter, tilesNum,
    content, className, setTileTimer, tileNavigationFill, carouselNavFunction} : CarouselNavigationProps){
  // Go to next carousel tile, reset timer
  function nextTile(){
    if(carousel.current){
      clearInterval(tileTimer.current!);
      carousel.current.scrollLeft += carousel.current.clientWidth * 0.65;
      tileCounter.current++;
      carouselNavFunction();
      setTileTimer();
      tileNavigationFill();
      Array.from(document.getElementsByClassName("carousel-title-image-wrapper") as HTMLCollectionOf<HTMLDivElement>).forEach(element=>{
        element.style.cssText = "";
      });
      Array.from(document.getElementsByTagName("iframe")).forEach(element=>{
        element.style.cssText = "";
      });
      Array.from(document.getElementsByClassName("carousel-title-trailer-event-trigger") as HTMLCollectionOf<HTMLDivElement>).forEach(element=>{
        element.style.cssText = "";
      });
      if(tileCounter.current > tilesNum){
        tileCounter.current = 0;
        carousel.current.scrollLeft = 0;
      }
    }
  }

  // Go to previous carousel tile, reset timer
  function previousTile(){
    if(carousel.current){
      clearInterval(tileTimer.current!);
      carousel.current.scrollLeft -= carousel.current.clientWidth * 0.65;
      tileCounter.current--;
      carouselNavFunction();
      setTileTimer();
      tileNavigationFill();
      Array.from(document.getElementsByClassName("carousel-title-image-wrapper") as HTMLCollectionOf<HTMLDivElement>).forEach(element=>{
        element.style.cssText = "";
      });
      Array.from(document.getElementsByTagName("iframe")).forEach(element=>{
        element.style.cssText = "";
      });
      Array.from(document.getElementsByClassName("carousel-title-trailer-event-trigger") as HTMLCollectionOf<HTMLDivElement>).forEach(element=>{
        element.style.cssText = "";
      });
      if(tileCounter.current < 0){
        tileCounter.current = 0;
        carousel.current.scrollLeft = 0;
      }
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
  const carousel = useRef<HTMLDivElement | null>(null);
  const [titlesCarousel, setTitlesCarousel] = useState([{
    platforms: [""],
    imgURL: "",
    title: "",
    id: "",
    summary:"",
    videoURL: "",
  }]);

  // Variables (Carousel timer/Counter)
  const tilesNum = useMemo<number>(()=> titlesCarousel.length, [titlesCarousel]);
  let tileCounter = useRef<number>(0);
  const tileTimer = useRef<NodeJS.Timer | null>(null);

  // Variables (Trailer Video)
  const trailer = useRef(null);

  // Display video if hovered over (PC) or tapped (Mobile).
  function videoSelected(){
    const iFrameTrigger = Array.from(document.getElementsByClassName("carousel-title-trailer-event-trigger") as HTMLCollectionOf<HTMLDivElement>);
    const iFrames = Array.from(document.getElementsByClassName("carousel-title-trailer") as HTMLCollectionOf<HTMLIFrameElement>);
    const carouselTitles = Array.from(document.getElementsByClassName("carousel-title-image-wrapper") as HTMLCollectionOf<HTMLDivElement>);
    console.log("Clicked on video!");
    clearInterval(tileTimer.current!);
    carouselTitles.forEach(element=>{
      element.style.zIndex = "1";
    })
    iFrames.forEach(element =>{
      element.style.height = "33rem";
    });
    iFrameTrigger.forEach(element=>{
      element.style.display = " none";
    })
  }

  // Variables (Carousel Navigation)
  const [tileNav, setTileNav] = useState<JSX.Element[]>([]);

  // Fill background of tile navigation buttons based on tile counter
  function tileNavigationFill(){
   const tileNavs = Array.from(document.getElementsByClassName("tile-nav-button") as HTMLCollectionOf<HTMLButtonElement>);
   tileNavs.forEach(element=>{
    if(element.id === `tile${tileCounter.current.toString()}`){
      element.style.background = "rgba(44, 0, 58, 1)";
    }
    else{
      element.style.background = "";
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
      carousel.current!.scrollLeft += carousel.current!.clientWidth * 0.65;
      tileCounter.current++;
      carouselNavFunction();
      if(tileCounter.current === tilesNum){
        carousel.current!.scrollLeft = 0;
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
              carousel.current!.scrollLeft = carousel.current!.clientWidth * i;
              tileCounter.current = i;
              tileNavigationFill();
              carouselNavFunction();
              Array.from(document.getElementsByClassName("carousel-title-image-wrapper") as HTMLCollectionOf<HTMLDivElement>).forEach(element=>{
                element.style.cssText = "";
              });
              Array.from(document.getElementsByTagName("iframe")).forEach(element=>{
                element.style.cssText = "";
              });
              Array.from(document.getElementsByClassName("carousel-title-trailer-event-trigger") as HTMLCollectionOf<HTMLDivElement>).forEach(element=>{
                element.style.cssText = "";
              });
              clearInterval(tileTimer.current!);
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
    fetch("/api/games/carousel")
    .then(response => response.json())
    .then(data =>{
      setTitlesCarousel(data);
    })
    .catch(err =>{
      console.log(err);
    });

    tileTimer.current = setInterval(()=>{
      carousel.current!.scrollLeft += carousel.current!.clientWidth * 0.65;
      tileCounter.current++;
      carouselNavFunction();
      if(tileCounter.current === tilesNum){
        carousel.current!.scrollLeft = 0;
        tileCounter.current = 0;
      }
      tileNavigationFill();
    }, 9000);

    return ()=>{
      clearInterval(tileTimer.current!);
    }
  }, [tilesNum]);

  return(
    <div id="home-page-carousel" ref={carousel}>
      {titlesCarousel.map((title, index) =>
        <div className="carousel-title-wrapper" key={title.id} >
          <img alt="title" src={title.imgURL} className="carousel-title-imagebg" />
          <Link className="carousel-title-image-wrapper" title={title.title} to={`/info?title=${title.id}`}>
            <img alt="title" src={title.imgURL} className="carousel-title-image" />
            <div className="carousel-title-platforms">
              {title.platforms.includes("XSX") || title.platforms.includes("XSS") ? <img src={xbox} alt="Xbox"/> : null}
              {title.platforms.includes("PS4") || title.platforms.includes("PS5") ? <img src={playstation} alt="Xbox"/> : null}
              {title.platforms.includes("PC") ? <img src={pc} alt="Xbox"/> : null}
              {title.platforms.includes("Switch") ? <img src={nintentdo} alt="Xbox"/> : null}
            </div>
          </Link>
            {document.querySelector('body')!.clientWidth >= 1200 ? 
              <div className="carousel-title-trailer-event-trigger" onClick={videoSelected}>
              </div> : null
            }
            {document.querySelector('body')!.clientWidth >= 1200 ? 
              <iframe src={`${title.videoURL}?controls=0&enablejsapi=1&origin=http://localhost:3000/&autoplay=1&playlist=${title.videoURL.slice(30, title.videoURL.length)}&loop=1`} className="carousel-title-trailer" 
              title="Title Trailer" ref={trailer} /> : null
            }
            {document.querySelector('body')!.clientWidth >= 1700 ?
              <div className="carousel-title-summary-wrapper">
              <p className="carousel-title-summary">
                {title.summary}
              </p>
              </div> : null
            }
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
type CategoryNavigationProps = {
  content: string,
  className: string,
}

 export function CategoryNavigation({content, className}: CategoryNavigationProps){
  function leftNav(event: React.MouseEvent<HTMLButtonElement>){
    const relative = event.currentTarget.parentElement!.children.item(1);
    const parent = event.currentTarget!.parentElement;
    relative!.scrollLeft -= 300;
    if(relative!.scrollLeft <= relative!.clientWidth * 0.1){
      parent!.children.item(2)!.classList.add("hidden");
      parent!.children.item(3)!.classList.remove("hidden");
    }
    else{
      parent!.children.item(3)!.classList.remove("hidden");
    }
  }

  function rightNav(event: React.MouseEvent<HTMLButtonElement>){
    const relative = event.currentTarget.parentElement!.children.item(1);
    const parent = event.currentTarget.parentElement;
    relative!.scrollLeft += 300;
    if(relative!.scrollLeft > 0){
      parent!.children.item(2)!.classList.remove("hidden");
    }
    if(relative!.scrollLeft >= relative!.scrollWidth - relative!.clientWidth){
      parent!.children.item(3)!.classList.add("hidden");
    }
  }

  return(
    <button className={className} onClick={content === "<" ? leftNav : rightNav}>
      {content}
    </button>
  );
}

// All categories
function Categories(){
  // Variables
  const genres = useRef<[string]>([""]);
  const [titles, setTitles] = useState([{
    tags: [""],
    id: "",
    title: "",
    imgURL: "",
  }]);

  // Store all the categories in an array
  useEffect(()=>{
    (function():void{
      genres.current[0] = titles[0].tags[0];
      titles.forEach((title, index) =>{
        for(let i = 1; i < title.tags.length; i++){
          if(!genres.current!.includes(title.tags[i])){
            genres.current!.push(title.tags[i]);
          }
        }
      });
    })();

    return()=>{
      genres.current = [""];
    }
  }, [titles]);

  // Check if device is touch, if so enable scroll.
  function ifTouch(){
    const allCategories = Array.from(document.getElementsByClassName("home-page-genre") as HTMLCollectionOf<HTMLDivElement>);
    allCategories.forEach(element =>{
      element.style.overflowX = "scroll";
    })
  }

  // Get all titles
  useEffect(()=>{
    fetch("/api/games")
    .then(response => response.json())
    .then(data =>{
      setTitles(prev => prev = data);
    })
    .catch(err=>{
      console.log(err);
    })
  }, [])

  // Hide category navigations (< >) if container can't be scrolled.
  useEffect(()=>{
    const allCategories = Array.from(document.getElementsByClassName("home-page-genre") as HTMLCollectionOf<HTMLDivElement>);
    allCategories.forEach(element =>{
      if(element.scrollWidth > element.offsetWidth){
        element.parentElement!.children.item(3)!.classList.remove("hidden");
      }
    });

    return ()=>{
      allCategories.forEach(element =>{
        element.parentElement!.children.item(3)!.classList.add("hidden");
      });
    }
  }, [titles])

  return(
    <div id="home-page-categories">
      {genres.current.map((genre, index) =>
        <div key={`genre${index}`} className="home-page-genre-container">
          <h2 className="home-page-section-title">{genre}</h2>
          <div className="home-page-genre" onTouchStart={ifTouch}>
            {titles.map(title =>
            title.tags.includes(genre) ? 
            <Link key={title.id} className="genre-titles" title={title.title} to={`/info?title=${title.id}`}>
              <img className="genre-title-image" src={title.imgURL} alt="Title" />
            </Link> : null)}
          </div>
          <CategoryNavigation className={"category-navigation category-left hidden"} content={"<"} />
          <CategoryNavigation className={"category-navigation category-right hidden"} content={">"} />
        </ div>)}
    </div>
  );
}

// Home Page
function HomePage(){
  const [isBackendServing, setIsBackendServing] = useState<boolean>(false);

  useEffect(()=>{
    const keepCheckingBackend = setInterval(isBackendOn, 3000);

    function isBackendOn():void{
      fetch("https://gsbackend.herokuapp.com/api/games", {
        method: "GET",
        mode: "no-cors"
      })
      .then(response => response)
      .then(data =>{
        console.log(data);
        if(data.ok){
          setIsBackendServing(prev => prev = true);
          clearInterval(keepCheckingBackend);
        }
      })
      .catch(err =>{
        console.log("Something went wrong! " + err);
      })
    }

    return() =>{
      clearInterval(keepCheckingBackend);
    }
  });
  
  return(
    <main id="home-page-bg">
      {isBackendServing ?
        <div id="home-page">
        <Header item={<SearchRedirect />}/>
        <Carousel />
        <Categories />
        </div>
        : <div>Loading...</div>
      }
    </main>
  );
}

export default HomePage;