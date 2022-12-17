import React from 'react';
import {useState, useRef, useEffect} from 'react';
import { mainPageOptions, filtersArr } from '../js/main';
import '../css/main-page.css';
import '../css/general.css';
import Header from '../general-components/header';


// ITERATE THROUGH YOUR STUFF, DON'T HARD CODE!!! E.g. Tags and Platforms

// Clear Filters Arrays
function clearFiltersArr(){
  Object.keys(filtersArr).forEach(key => {
    filtersArr[key] = [];
  });
  document.querySelectorAll('input').forEach(element =>{
    element.checked = false;
  });
}

function SearchBar({appendTitles}){
  // Variables
  const searchValue = useRef(null);
  const [clear, setClear] = useState(null);
  let url = "";
  const [currentValue, setCurrentValue] = useState(url);

  // Clear search bar
  function ClearBarButton(){
    function clearBar(){
      setCurrentValue("");
      window.history.pushState(null, null, `?entry=`);
      setClear(null);
      setTimeout(searchForTitle, 600);
    }

    return(
      <div id="searchbar-clear-button-wrapper">
        <button id="searchbar-clear-button"
              onClick={clearBar}>
        x
        </button> 
      </div>
    );
  }

  function showClearButton(){
    if(searchValue.current.value !== ""){
      setClear(<ClearBarButton />);
    }
    else{
      setClear(null);
    }
  }

  // Set the value of the search bar if query is present in URL on load
  if(window.location.href.includes("?entry=")){
    let index = 0;
    for(let i = 0; i < window.location.href.length; i++){
      if(window.location.href[i] === "="){
        index = i + 1;
        break;
      }
    }
    url = window.location.href.slice(index, window.location.href.length);
  }

  // Set user inputs into the search bar and url (useful for history)
  function getInput(event){
    showClearButton();
    if(event.nativeEvent.data === null){
      setCurrentValue(currentValue.slice(0, -1));

    }
    else{
      setCurrentValue(currentValue + event.nativeEvent.data);
    }
    window.history.pushState(null, null, `?entry=${searchValue.current.value}`);
  }

  // Search for titles based on search bar value
  async function searchForTitle(){
    try{
      const response = await fetch(`/search?entry=${searchValue.current.value.toLowerCase()}`,{
        method: 'get'
      });
      await response.json()
      .then(title=>{
        mainPageOptions.foundTitles = title;
        clearFiltersArr();
        appendTitles();
      });
    }
    catch(err){
      console.log(err);
    }
  }

  return(
    <div id='searchbar-container'>
      <input id='searchbar' autoFocus autoComplete='off' placeholder="Search for titles"  
            ref={searchValue} onKeyUp={searchForTitle} 
            value={currentValue} onInput={getInput}/>
      {clear}
    </div>
  );
}

// All Filters and filter overlay.   
// All written in the same order, except overlay.
function Tags({appendTitles, titles}){
  // Variables
  const filter = useRef(null);
  const filterBg = useRef(null);
  const [tags, setTags] = useState([]);

  // Open the filter and some styling stuff
  function showFilter(){
    if(mainPageOptions.isSelectionOpen === false){
      mainPageOptions.isSelectionOpen = true;
      filter.current.classList.remove('hidden');
      filterBg.current.style.background = "rgb(0, 6, 12)";
      filterBg.current.style.border = "2px solid rgba(107, 107, 107, 1)";
    }
  }

  // Filter titles based on selected filters
  function applyFilter(event){
    const value = event.target.value;
    if(event.target.checked){
      filtersArr.genre.push(value);
    }
    else{
      const newArr = filtersArr.genre.filter((genre)=>{
        if(genre.includes(value)){
          return false;
        }
        else{
          return true;
        }
      });
      filtersArr.genre = newArr;
    }
    appendTitles();
  }

  useEffect(()=>{
    // Append the filters of the current titles on the page
    function setRetrievedTags(){
      // Check for dupes
      if(mainPageOptions.foundTitles !== null && mainPageOptions.foundTitles.length > 0){
        let allTags = [];
        for(let i = 0; i < mainPageOptions.foundTitles.length; i++){
          for(let j = 0; j < mainPageOptions.foundTitles[i].tags.length; j++){
            if(allTags.includes(mainPageOptions.foundTitles[i].tags[j]) === false){
              allTags.push(mainPageOptions.foundTitles[i].tags[j]);
            }
          }
        }
        setTags(allTags);
      }
      else{
        setTimeout(setRetrievedTags, 1000);
      }
    }
    setRetrievedTags();
  }, [titles]);
 
  return(
    <div id="tags-selection-container"
         ref={filterBg} className="filters">
      <div onClick={showFilter} className="filter-title">
        Genre
      </div>
      <ul className="custom-selections hidden" id="tag-selections"
          ref={filter}>
        {tags.map((tags, index) => 
          <li key={index}>
            <input type="checkbox" value={tags} id={tags} onChange={applyFilter} />
            <label htmlFor={tags}>{tags}</label>
          </li>)}
      </ul>   
    </div>
  );
}

function Platforms({appendTitles, titles}){
  // Variables
  const filter = useRef(null);
  const filterBg = useRef(null);
  const [platforms, setPlatforms] = useState([]);
  
  function showFilter(){
    if(mainPageOptions.isSelectionOpen === false){
      mainPageOptions.isSelectionOpen = true;
      filter.current.classList.remove('hidden');
      filterBg.current.style.background = "rgb(0, 6, 12)";
      filterBg.current.style.border = "2px solid rgba(107, 107, 107, 1)";
    }
  }

  // Filter titles based on selected filters
  function applyFilter(event){
    const value = event.target.value;
    if(event.target.checked){
      filtersArr.platforms.push(value);
    }
    else{
      const newArr = filtersArr.platforms.filter((platform)=>{
        if(platform.includes(value)){
          return false;
        }
        else{
          return true;
        }
        });
        filtersArr.platforms = newArr;
    }
    appendTitles();
  }
  

useEffect(()=>{
  // Show filters based on titles retrieved from database
  function setRetrievedPlatforms(){
    if(mainPageOptions.foundTitles !== null && mainPageOptions.foundTitles.length > 0){
      let allPlatforms = [];
      for(let i = 0; i < mainPageOptions.foundTitles.length; i++){
        for(let j = 0; j < mainPageOptions.foundTitles[i].platforms.length; j++){
          if(allPlatforms.includes(mainPageOptions.foundTitles[i].platforms[j]) === false){
            allPlatforms.push(mainPageOptions.foundTitles[i].platforms[j]);
          }
        }
      }
      setPlatforms(allPlatforms);
    }
    else{
      setTimeout(setRetrievedPlatforms, 1000);
    }  
  }

  setRetrievedPlatforms();
}, [titles]);

  return(
    <div id="platforms-selection-container"
           className="filters" ref={filterBg}>
      <div onClick={showFilter} className="filter-title">
        Platforms
      </div>
      <ul className="custom-selections hidden" 
          id="platform-selections" ref={filter}>
        {platforms.map((platforms, index)=>
          <li key={index}>
            <input type="checkbox"  value={platforms} id={platforms} onChange={applyFilter}/>
            <label htmlFor={platforms}>{platforms}</label>
          </li>)}
      </ul>   
    </div>
  );
}

function Year({appendTitles, titles}){
  // Variables
  const filter = useRef(null);
  const filterBg = useRef(null);
  const [year, setYear] = useState([]);

  function showFilter(){
    if(mainPageOptions.isSelectionOpen === false){
      mainPageOptions.isSelectionOpen = true;
      filter.current.classList.remove('hidden');
      filterBg.current.style.background = "rgb(0, 6, 12)";
      filterBg.current.style.border = "2px solid rgba(107, 107, 107, 1)";
    }
  }

  // Apply the selected filter(s)
  function applyFilter(event){
    const value = event.target.value;
    if(event.target.checked){
      filtersArr.year.push(value);
    }
    else{
      const newArr = filtersArr.year.filter((year)=>{
        if(year.includes(value)){
          return false;
        }
        else{
          return true;
        }
      });
      filtersArr.year = newArr;
    }
    appendTitles();
  }

useEffect(()=>{
  // Show filters based on retrieved titles from database
  function setRetrievedReleaseDates(){
    if(mainPageOptions.foundTitles !== null && mainPageOptions.foundTitles.length > 0){
      let allDates = [];
      for(let j = 0; j < mainPageOptions.foundTitles.length; j++){
        if(allDates.includes(mainPageOptions.foundTitles[j].releaseDate.slice(6, 10)) === false){
          allDates.push(mainPageOptions.foundTitles[j].releaseDate.slice(6, 10));
        }
      }
      setYear(allDates);
    }
    else{
      setTimeout(setRetrievedReleaseDates, 1000);
    }  
  }

  setRetrievedReleaseDates();
}, [titles]);

  return(
    <div id="year-selection-container" className='filters'
        ref={filterBg}>
      <div className="filter-title" onClick={showFilter}>Year</div>
      <ul className="custom-selections hidden" id="year-selections"
          ref={filter}>
        {year.map((year, index)=>
          <li key={index}>
            <input type="checkbox" value={year} id={`year ${year}`}
                  onChange={applyFilter} className="filter-checkbox"/>
            <label htmlFor={year}>{year}</label>
          </li>)}
      </ul>   
    </div>
  );
}

function FilterOverlay(){
  const filterOverlay = useRef(null);

  function closeFilters(){
    if(mainPageOptions.isSelectionOpen){
      Array.from(document.getElementsByClassName('custom-selections')).forEach(element =>{
        element.classList.add('hidden');
      });
      Array.from(document.getElementsByClassName('filters')).forEach(element =>{
        element.style.cssText = null;
        
      })
      filterOverlay.current.classList.add('hidden');
      mainPageOptions.isSelectionOpen = false;
    }
  }

  return(
    <div id="transparent-overlay"
        ref={filterOverlay} onClick={closeFilters}>
    </div>
  ); 
}

function Publishers({appendTitles, titles}){
  const [publishers, setPublishers] = useState([]);
  const filter = useRef(null);
  const filterBg = useRef(null);

  function showFilter(){
    if(mainPageOptions.isSelectionOpen === false){
      mainPageOptions.isSelectionOpen = true;
      filter.current.classList.remove('hidden');
      filterBg.current.style.background = "rgb(0, 6, 12)";
      filterBg.current.style.border = "2px solid rgba(107, 107, 107, 1)";
    }
  }

  // Apply selected filter(s)
  function applyFilter(event){
    const value = event.target.value;
    if(event.target.checked){
          filtersArr.publishers.push(value);
    }
    else{
      const newArr = filtersArr.publishers.filter((publisher)=>{
        if(publisher.includes(value)){
          return false;
        }
        else{
          return true;
        }
      });
      filtersArr.publishers = newArr;
    }
    appendTitles();
  }
   
  useEffect(() =>{
    // Show filters based on retrieved titles from database
    function setRetrievedPublishers(){
      const titleArr = mainPageOptions.foundTitles;
      const allPublishers = [];
      if(titleArr !== null && titleArr.length > 0){
        for(let i = 0; i < titleArr.length; i++){
          if(!allPublishers.includes(titleArr[i].publisher)){
            allPublishers.push(titleArr[i].publisher);
          }
        }
        setPublishers(allPublishers);
      }
      else{
        setTimeout(setRetrievedPublishers, 1000);
      }
    }

    setRetrievedPublishers();
  },[titles]);

  return(
    <div id="publishers-selection-container"
        className="filters" ref={filterBg}>
      <div onClick={showFilter} className="filter-title">
        Publishers
      </div>
      <ul className="custom-selections hidden" id="publisher-selections"
            ref={filter}>
        {publishers.map((publisher, index)=>
          <li key={index}>
            <input type="checkbox"  value={publisher} 
                  id={`publisher${index}`} key={index} onChange={applyFilter}/>
            <label htmlFor={`publisher${index}`} key={`key${index}`}>
              {publisher}
            </label>
          </li>)}
      </ul>   
    </div>
  );
}

// Search Page
function App(){
  // Variables
  const [filterOverlay, setfilterOverlay] = useState(null);
  const [searchedTitles, setSearchedTitles] = useState([]);

  // Global function, checks if a filter is open and opens the filter if so.
  function openFilterOverlay(){
    if(mainPageOptions.isSelectionOpen){
      setfilterOverlay(<FilterOverlay />);
    }
    else{
      setfilterOverlay(null);
    }  
  }

  // Append the titles and/or filtered titles to the page.
  function appendSearchedTitles(){
    const titlesArr = mainPageOptions.foundTitles;
    const titles = [];

    // Filter the retrieved titles from database based on the selected filters.
    // *Declare counters to compare with the length of the arrays of "filtersArr" (look at imports).*
    for(let j = 0; j < titlesArr.length; j++){
      let containsYear = 0;
      let containsGenre = 0;
      let containsPlatform = 0;
      let containsPublisher = 0;

      // *Update counters*
      (function (){
        for(let i = 0; i < filtersArr.genre.length; i++){
          if(titlesArr[j].tags.includes(filtersArr.genre[i])){
                containsGenre++;
          }
        }
        for(let i = 0; i < filtersArr.year.length; i++){
          if(titlesArr[j].releaseDate.includes(filtersArr.year[i])){
            containsYear++;
          }
        }
        for(let i = 0; i < filtersArr.platforms.length; i++){
          if(titlesArr[j].platforms.includes(filtersArr.platforms[i])){
            containsPlatform++;
          }
        }
        for(let i = 0; i < filtersArr.publishers.length; i++){
          if(titlesArr[j].publisher.includes(filtersArr.publishers[i])){
            containsPublisher++;
          }
        } 
      })();

    // *Append filtered titles (if the filters array aren't empty)*
      if((filtersArr.year.length > 0 || filtersArr.genre.length > 0
        || filtersArr.platforms.length > 0 || filtersArr.publishers.length > 0)
          && (containsGenre === filtersArr.genre.length && containsYear === filtersArr.year.length)
          && containsPlatform === filtersArr.platforms.length && containsPublisher === filtersArr.publishers.length){
              
          titles.push(titlesArr[j]);
           containsYear = 0;
           containsGenre = 0;
           containsPlatform = 0;
           containsPublisher = 0;
      }
      // Append all titles (if filter arrays are empty)
      else if(filtersArr.year.length === 0 && filtersArr.genre.length === 0 
              && filtersArr.platforms.length === 0 && filtersArr.publishers.length === 0){
                    
                titles.push(titlesArr[j]);
      } 
  }
  setSearchedTitles(titles); // *Change page state (Titles)* 
} 

  // Get titles based on URL and append to page
  useEffect(()=>{
    fetch(window.location.href)
    .then(res => res.json())
    .then(foundItems=>{
      mainPageOptions.foundTitles = foundItems;
      setSearchedTitles(mainPageOptions.foundTitles);
    })
    .catch(err=>{
      console.log(err);
    });
  }, []);
 
  return (
    <main id="search-page" onClick={openFilterOverlay}>
      <Header item={<SearchBar appendTitles={appendSearchedTitles} />}/>
      <div id="game-filters-container">
        <Year appendTitles={appendSearchedTitles} titles={searchedTitles}/>
        <Tags appendTitles={appendSearchedTitles} titles={searchedTitles}/>
        <Platforms appendTitles={appendSearchedTitles} titles={searchedTitles}/>
        <Publishers appendTitles={appendSearchedTitles} titles={searchedTitles}/>
      </div>
      <section id="searched-titles">
        {searchedTitles.map(game=>
          <div key={game._id} className="searched-title-container">
            <div className='searched-title-image-container'>
              <img src={game.imgURL} alt="Poster" className="searched-title-image"></img>
            </div>
            <div className='searched-title-title-container'>
            < p className="searched-title-title">{game.title}</p>
            </div>
          </div>)}
      </section>
      {filterOverlay}
    </main>
  );
}
  
export default App;