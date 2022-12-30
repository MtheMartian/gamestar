import React from 'react';
import {useEffect, useState, useRef} from 'react';
import Header from '../general-components/header';
import '../css/general.css';
import '../css/title-info.css';
import '../css/homepage.css';
import xbox from '../images/xbox.png';
import playstation from '../images/ps.png';
import pc from '../images/pc.png';
import nintentdo from '../images/switch.png';
import {CategoryNavigation} from '../pages/Home';

function SearchRedirect(){
  return(
    <a href="/search">
      <img alt="search"></img>
    </a>
  );
}

function Card(){
  const [title, setTitle] = useState(null);

  useEffect(()=>{
    const url = window.location.href.toLowerCase();
    let index = 0;
    
    for(let i = 0; i < url.length; i++){
      if(url[i] === "="){
        index = i + 1;
        break;
      }
    }

    fetch(`/api/info?title=${url.slice(index, url.length)}`)
    .then(response => response.json())
    .then(data =>{
      setTitle(prev => prev = data);
    })
    .catch(err=>{
      console.log(err);
    })
  }, [])

  return(
    <section id="card-container">
      <div id="card">
        {title !== null ? <img src={title.imgURL} className="card-title-image" alt="Title" /> : null}
        <div id="card-title-platforms">
          {title !== null ? title.platforms.includes("XSX") || title.platforms.includes("XSS") ? 
            <a href={title.consoleLinks["xbox"]}><img src={xbox} alt="Xbox"/></a> : null : null}
          {title !== null ? title.platforms.includes("PS4") || title.platforms.includes("PS5") ? 
            <a href={title.consoleLinks["pStore"]}><img src={playstation} alt="PS"/></a> : null : null}
          {title !== null ? title.platforms.includes("PC") ? 
            <a href={title.pcLinks["steam"] !== "" ? title.pcLinks["steam"] : title.pcLinks["epicStore"]}><img src={pc} alt="PC"/></a> : null : null}
          {title !== null ? title.platforms.includes("Switch") ? 
            <a href={title.consoleLinks["nintendo"]}><img src={nintentdo} alt="Switch"/></a> : null : null}
        </div>
        <div id="card-title-summary-wrapper">
          {title !== null ? <p id="card-title-summary">{title.summary}</p> : null}
        </div>
      </div>
      <div id="card-title-release-date">Release Date: {title !== null ? title.releaseDate : "N/A"}</div>
    </section>
  );
}

function Videos(){
  const [title, setTitle] = useState(null);

  useEffect(()=>{
    const url = window.location.href.toLowerCase();
    let index = 0;
    
    for(let i = 0; i < url.length; i++){
      if(url[i] === "="){
        index = i + 1;
        break;
      }
    }

    fetch(`/api/info?title=${url.slice(index, url.length)}`)
    .then(response => response.json())
    .then(data =>{
      setTitle(prev => prev = data);
    })
    .catch(err=>{
      console.log(err);
    })
  }, [])

  return(
    <section id="videos-container">
      {title !== null ? 
      <iframe src={`${title.videoURL}?controls=1&enablejsapi=1&origin=http://localhost:3000/&autoplay=1&playlist=${title.videoURL.slice(30, title.videoURL.length)}&loop=1`} className="videos-title" title="Trailer" allow="fullscreen"/> 
      : null}
      {title !== null ? title.gameplayVid !== "" ?
      <iframe src={`${title.gameplayVid}?controls=1&enablejsapi=1&origin=http://localhost:3000/&autoplay=1&playlist=${title.gameplayVid.slice(30, title.gameplayVid.length)}&loop=1`} className="videos-title" title="GamePlay" allow="fullscreen"/> 
      : null : null}
    </section>
  )
}

function SimilarTitles(){
  const [titles, setTitles] = useState([]);
  const similarTitles = useRef(null);

  // Check if device is touch, if so enable scroll.
  function ifTouch(){
    similarTitles.current.style.overflowX = "scroll";
  }

  useEffect(()=>{
    const url = window.location.href.toLowerCase();
    let index = 0;
    
    for(let i = 0; i < url.length; i++){
      if(url[i] === "="){
        index = i + 1;
        break;
      }
    }

    fetch(`/api/info/similar/${url.slice(index, url.length)}`)
    .then(response => response.json())
    .then(data =>{
      setTitles(prev => prev = data);
    })
    .catch(err=>{
      console.log(err);
    })

  }, [])

  useEffect(()=>{
    if(similarTitles.current.scrollWidth > similarTitles.current.offsetWidth){
      similarTitles.current.parentElement.children.item(3).classList.remove("hidden");
    }
  }, [titles])

  return(
    <section id="similar-titles-container">
      <h2 id="similar-section-title">Similar Games</h2>
      <div id="similar-titles-wrapper" onTouchStart={ifTouch} ref={similarTitles}>
        {titles.map(similarTitle=>
          <a key={similarTitle._id} className="genre-titles" title={similarTitle.title} href={`/info?title=${similarTitle._id}`}>
            <img className="genre-title-image" src={similarTitle.imgURL} alt="Title" />
          </a>
        )}
      </div>
      <CategoryNavigation className={"category-navigation category-left hidden"} content={"<"} />
      <CategoryNavigation className={"category-navigation category-right hidden"} content={">"} />
    </section>
  )
}

function TitleInfo(){
  return(
    <main id="title-info-page-bg">
      <div id="title-info-page">
        <Header item={<SearchRedirect />}/>
        <Card />
        <Videos />
        <SimilarTitles />
      </div>
    </main>
  )
}

export default TitleInfo;