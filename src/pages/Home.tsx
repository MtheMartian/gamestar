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
import { getCarouselTitles, retrieveGames, wakeUp} from '../js/admin';
import Loader from '../general-components/PageLoader';
import { TypeGame } from '../js/types';

function SearchRedirect(){
  return(
    <Link to="/search" id="search-section-wrapper">
      <span>Search</span>
      <span className="material-symbols-outlined" id="search-icon">
        search
      </span>
    </Link>
  );
}

function CarouselNavigation(props: {titles: TypeGame[] | null}){
  const [carouselTitles, setCarouselTitles] = useState<typeof props.titles>(null);
  const tileCounter = useRef<number>(0);
  const carouselTimer = useRef<NodeJS.Timer | null>(null);

  function timer():NodeJS.Timer{
    const carouselTimer: NodeJS.Timer = setInterval(()=>{
      setTimeout(()=>{
        tileCounter.current++;
        if(tileCounter.current > carouselTitles!.length - 1){
          tileCounter.current = 0;
        }
        document.getElementById(`tile${tileCounter.current}`)?.scrollIntoView({
          behavior: "smooth"
        });
        highlightTile(`tile${tileCounter.current}`);
      }, 100);
    }, 9000);
    return carouselTimer;
  }

  function getIdFromHref(id: string, skip: number): string{
    let tileId: string = "";
    let start: number = 0;
    let counter: number = 0;
    for(let i: number = 0; i < id.length; i++){
      if(id[i] === '/' && counter < 3){
        start = i;
      }
      if(counter === 3) break;
    }
    return tileId = id.slice(start + skip);
  }

  function highlightTile(tileId: string): void{
    const tileNavElements: HTMLAnchorElement[] = Array.from(document.getElementsByClassName("current-tile-title") as HTMLCollectionOf<HTMLAnchorElement>);
    tileNavElements.forEach(element =>{
      if(getIdFromHref(element.href, 2) !== tileId){
        element.style.cssText = "";
      }
      else{
        element.style.opacity ="1";
      }
    }) 
  }

  useEffect(()=>{
    setCarouselTitles(prev => prev = props.titles);

    return()=>{
      setCarouselTitles(prev => prev = null);
    }
  }, [props.titles]);

  useEffect(()=>{
    if(carouselTitles){
      carouselTimer.current = timer();
    }

    return()=>{
      clearInterval(carouselTimer.current!);
    }
  }, [carouselTitles])

  function clickHandler(e: React.MouseEvent<HTMLAnchorElement>){
    e.preventDefault();
    clearInterval(carouselTimer.current!);
    tileCounter.current = Number(e.currentTarget.id);
    let tileId: string = getIdFromHref(e.currentTarget.href, 2);
    setTimeout(()=>{
      document.getElementById(tileId)?.scrollIntoView({
        behavior: "smooth"
      });
      highlightTile(tileId);
      carouselTimer.current = timer();
    }, 100);

  }

  return(
    <div id="carousel-navigation">
      {carouselTitles ? carouselTitles.map((title, index) =>
      <a className="current-tile-title" href={`#tile${index}`} id={`${index}`} onClick={clickHandler} key={`achor${index}`}>
        {title?.gameTitle}
      </a>
      ): null}
    </div>
  );
}

function Carousel(props: {titles: TypeGame[] | null}){ 
  const [carouselTitles, setCarouselTitles] = useState<typeof props.titles>(null);

  useEffect(()=>{
    setCarouselTitles(prev => prev = props.titles);

    return()=>{
      setCarouselTitles(prev => prev = null);
    }
  }, [props.titles]);

  return(
    <section id="home-page-carousel">
      {carouselTitles ? 
      <div id="home-page-carousel-wrapper">
        {carouselTitles.map((title, index) =>
          <div className="carousel-tile" id={`tile${index}`} key={`tile-key${index}`}>
            <img src={title?.imgURL} alt="background" className="carousel-tile-bg" key={`bg-key${index}`}/>
            <Link to={`/info?title=${title?.id}`} className="carousel-tile-image">
              <img src={title?.imgURL} alt="Title" key={`image-key${index}`} />
            </Link>
          </div>
        )}
      </div>: <Loader />}
    </section>
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

function Categories(props: {titles: TypeGame[] | null}){
  const games = useRef<TypeGame[] | null>(null);
  const genres = useRef<string[]>([]);

  useEffect(()=>{
    games.current = props.titles;
    return()=>{
      games.current = null;
    }
  }, [props.titles]);

  useEffect(()=>{
    if(games.current){
      for(let i: number = 0; i < games.current.length; i++){
        games.current[i]?.tags.forEach(genre =>{
          if(!genres.current.includes(genre)){
            genres.current.push(genre);
          }
        })
      }
    }
    console.log(genres.current);

    return()=>{
      genres.current = [];
    }
  }, [props.titles]);

  return(
    <section id="home-page-categories">
      {games.current?
      <div id="home-page-categories-wrapper">
        {genres.current.map((genre, index) =>
          <div className="home-page-category-wrapper" key={`categories${index}`}>
            <span className="home-page-category">{genre}</span>
          </div>
        )}
      </div> : <Loader />}
    </section>
  );
}

// Home Page
function HomePage(){
  const [isAwake, setIsAwake] = useState<boolean | undefined>(false);
  const [carouselTitles, setCarouselTiles] = useState<TypeGame[] | null>(null);
  const [allTitles, setAllTitles] = useState<TypeGame[] | null>(null);
 
  useEffect(()=>{
    async function checkServer(){
      const response = await wakeUp();
      setIsAwake(prev => prev = response);
    }
    checkServer();
  });

  useEffect(()=>{
    async function retrieveCarouselTitles(){
      const response = await getCarouselTitles();
      setCarouselTiles(prev => prev = response);
    }
    if(isAwake) retrieveCarouselTitles();

    return()=>{
      setCarouselTiles(prev => prev = null);
    }
  }, [isAwake]);

  useEffect(()=>{
    async function getGames(){
      const response = await retrieveGames();
      setAllTitles(prev => prev = response);
    }
     if(isAwake) getGames();

    return()=>{
      setAllTitles(prev => prev = null);
      
    }    
  }, [isAwake])

  return(
    <main id="home-page-bg">
      <div id="home-page">
        <Header item={<SearchRedirect />}/>
        <Carousel titles={carouselTitles} />
        <CarouselNavigation titles={carouselTitles} />
        <Categories titles={allTitles} />
      </div>
    </main>
  );
}

export default HomePage;