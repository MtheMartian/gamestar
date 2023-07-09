import React from 'react';
import {useRef, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../css/homepage.css';
import '../css/general.css';
import '../css/carousel.css';
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
    const _carouselTimer: NodeJS.Timer = setInterval(()=>{
      setTimeout(()=>{
        if(tileCounter.current === carouselTitles!.length - 1){
          tileCounter.current = 0;
          document.getElementById("home-page-carousel-wrapper")!.scrollTo({
            left: 0,
            behavior: "smooth"
          });
          clearInterval(carouselTimer.current!);
          carouselTimer.current = timer();
        }
        else{
          document.getElementById("home-page-carousel-wrapper")!.scrollLeft! += 
          document.getElementById(`tile${tileCounter.current}`)!.clientWidth!;
          tileCounter.current++;
        }
        highlightTile(`tile${tileCounter.current}`);
      }, 100);
    }, 9000);
    return _carouselTimer;
  }

  function getIdFromHref(id: string, skip: number): string{
    let start: number = 0;
    let counter: number = 0;
    for(let i: number = 0; i < id.length; i++){
      if(id[i] === '/' && counter < 3){
        start = i;
      }
      if(counter === 3) break;
    }
    return id.slice(start + skip);
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
      highlightTile(`tile0`);
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
        behavior: "smooth",
        block: "end",
        inline: "nearest"
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
  return(
    <section id="home-page-carousel">
      {props.titles ? 
      <div id="home-page-carousel-wrapper">
        {props.titles.map((title, index) =>
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

export function TitlesNavigation(props: {_genre: string, content: string, numberPages: number, currentElement: string}){
  function hideButton(e: React.MouseEvent<HTMLButtonElement>){
    const parentElement: HTMLElement | null = document.getElementById(props.currentElement);
    const page: HTMLElement | null = document.querySelector(".genre-pages");
    const pageLength: number = (page!.clientWidth - (page!.clientWidth * 0.45)) * (props.numberPages - 1);
    if(props.content === ">"){
      document.getElementById(`${props._genre}-left`)!.classList.remove("hidden");
      if(parentElement!.scrollLeft >= pageLength){
        e.currentTarget.classList.add("hidden");
      }
      console.log(parentElement!.scrollLeft);
      console.log(pageLength);
    }
    else if(props.content === "<"){
      document.getElementById(`${props._genre}-right`)!.classList.remove("hidden");
      if(parentElement!.scrollLeft <= 0){
        e.currentTarget.classList.add("hidden");
      }
    } 
  }

  function changePage(e: React.MouseEvent<HTMLButtonElement>): void{
    if(props.content === ">"){
      console.log(`Before:${document.getElementById(props.currentElement)!.scrollLeft}`);
      document.getElementById(props.currentElement)!.scrollLeft +=
      document.querySelector(".genre-pages")!.clientWidth;
      console.log(`Page:${document.querySelector(".genre-pages")!.clientWidth}`);
      hideButton(e);
    }
    else if(props.content === "<"){
      document.getElementById(props.currentElement)!.scrollLeft -=
      document.querySelector(".genre-pages")!.clientWidth;
      hideButton(e);
    }
  }

  useEffect(()=>{
    if(props.numberPages <= 1){
      document.getElementById(`${props._genre}-left`)!.classList.add("hidden");
      document.getElementById(`${props._genre}-right`)!.classList.add("hidden");
    }
    document.getElementById(`${props._genre}-left`)!.classList.add("hidden");
  }, [])

  return(
    <button className={props.content === ">" ? "titles-navigation right-button" : "titles-navigation left-button"} 
            onClick={changePage} id={props.content === ">" ? `${props._genre}-right` : `${props._genre}-left`}>
      {props.content}
    </button>
  );
}

export function Categories(props: {titles: TypeGame[] | null, sectionName: string}){
  const [titles, setTitles] = useState<TypeGame[] | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const numPages = useRef<number>(0);

  function returnPages(genre: string, _titles: typeof titles): JSX.Element[]{
    let genrePages: JSX.Element[] = [];
    if(_titles){
      let pageContents: JSX.Element[] = [];
      let titlesGenre: TypeGame[] | null = [];
      if(props.sectionName === ""){
        for(let i: number = 0; i < _titles.length; i++){
          if(_titles[i]!.tags.includes(genre)) titlesGenre!.push(_titles[i]);
        }
      }
      else{
        titlesGenre = props.titles;
      }
      
      let numberOfPages: number = Math.floor(titlesGenre!.length / 5);
      if(titlesGenre!.length % 5 !== 0) numberOfPages++;
      numPages.current = numberOfPages;

      let counter: number = 0;
      let lastIndex: number = 0;

      for(let i: number = 0; i < titlesGenre!.length; i++){
        pageContents.push(
          <a href={`/info?title=${titlesGenre![i]!.id}`} className="general-title-display" key={`genre-title-key${i}`}>
            <img src={titlesGenre![i]!.imgURL} alt="Title" />
          </a> 
        )
      }

      for(let i: number = 0; i < numberOfPages; i++){
        genrePages.push(
          <div id={`${genre}-page${i}`} className="genre-pages" key={`genre-page-key${i}`}>
            {(function(): JSX.Element[]{
              let currentTitles: JSX.Element[] = [];
              for(let j: number = lastIndex; j < titlesGenre!.length; j++){
                if(counter === 3){
                  lastIndex = j;
                  counter = 0;
                  break;
                }
                currentTitles.push(pageContents[j]);
                counter++;
              }
              return currentTitles;
            })()}
          </div>
        )
      }  
    }
    return genrePages;
  }

  useEffect(()=>{
    if(props.titles && props.sectionName === ""){
      let allGenres: string[] = [];
      for(let i: number = 0; i < props.titles.length; i++){
        props.titles[i]?.tags.forEach(genre =>{
          if(!allGenres.includes(genre)){
            allGenres.push(genre);
          }
        })
      }
      setGenres(prev => prev = allGenres);
      setTitles(prev => prev = props.titles);
    }
    else if(props.titles && props.sectionName !== ""){
      setGenres(prev => prev = [props.sectionName]);
      setTitles(prev => prev = props.titles);
    }

    return()=>{
      setGenres(prev => prev = []);
      setTitles(prev => prev = null);
    }
  }, [props.titles]);

  return(
    <section id="home-page-categories">
      {props.titles?
      <div id="home-page-categories-wrapper">
        {genres.map((genre, index) =>
          <div className="home-page-category-wrapper" key={`categories${index}`}>
            <span className="home-page-category">{genre}</span>
            <div className="home-page-category-titles-wrapper" id={`${genre}-titles-wrapper${index}`}>
              {returnPages(genre, titles)}
              <TitlesNavigation currentElement={`${genre}-titles-wrapper${index}`} _genre={genre}
                numberPages={numPages.current} content="<" />
              <TitlesNavigation currentElement={`${genre}-titles-wrapper${index}`} _genre={genre}
                numberPages={numPages.current} content=">" />
            </div> 
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
        <Categories titles={allTitles} sectionName="" />
      </div>
    </main>
  );
}

export default HomePage;