import React from 'react';
import {useEffect, useState} from 'react';
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


function HomePage(){
  return(
    <main id="home-page-container">
      <Header item={<SearchRedirect />}/>
      <div id="home-page">
        <div id="home-page-carousel">
          <div id="test1"></div>
          <div id="test2"></div>
          <a href="#test1" id="left">left</a>
          <a href="#test2" id="right">right</a>
        </div>
      </div>
    </main>
  );
}

export default HomePage;