import React from 'react';
import {useEffect, useState} from 'react';
import Header from '../general-components/header';
import '../css/general.css';
import '../css/title-info.css';
import xbox from '../images/xbox.png';
import playstation from '../images/ps.png';
import pc from '../images/pc.png';
import nintentdo from '../images/switch.png';

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
    <div id="card-container">
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
    </div>
  );
}

function TitleInfo(){
  return(
    <main id="title-info-page-bg">
      <div id="title-info-page">
        <Header item={<SearchRedirect />}/>
        <Card />
      </div>
    </main>
  )
}

export default TitleInfo;