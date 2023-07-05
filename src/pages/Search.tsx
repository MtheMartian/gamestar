import React, { SyntheticEvent } from 'react';
import {useState, useRef, useEffect, useCallback} from 'react';
import { Link } from 'react-router-dom';
import '../css/search-page.css';
import '../css/general.css';
import Header from '../general-components/header';
import { wakeUp } from '../js/admin';
import { TypeGame, TypeFilters } from '../js/types';
import Loader from '../general-components/PageLoader';

// ITERATE THROUGH YOUR STUFF, DON'T HARD CODE!!! E.g. Tags and Platforms


// Clear Filters Arrays
function clearFiltersArr(){
  Object.keys(filterArrays).forEach(key => {
    filterArrays[key] = [];
  });
  document.querySelectorAll('input').forEach(element =>{
    element.checked = false;
  });
}

// Fields
let titlesArr: TypeGame[] = [];
let entryFromUrl: string = "";
let filterArrays: TypeFilters = {year: [], genre: [],
                                  platforms: [], publishers: []};
let isSelectionOpen: boolean = false;

// Search Bar
type SearchbarProps = {
  appendTitles: Function,
}

function SearchBar({appendTitles}: SearchbarProps){
  // Variables
  const searchValue = useRef<HTMLInputElement | null>(null);
  const [clear, setClear] = useState<JSX.Element | null>(null);
  let url: string = "";
  const [currentValue, setCurrentValue] = useState<string>(url);

  // Clear search bar
  function ClearBarButton(){
    function clearBar(){
      setCurrentValue("");
      window.history.pushState(null, "", `?entry=`);
      setClear(prev => prev = null);
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
    if(searchValue.current!.value !== ""){
      setClear(prev=>prev = <ClearBarButton />);
    }
    else{
      setClear(null);
    }
  }

  // Set the value of the search bar if query is present in URL on load
  if(window.location.href.includes("?entry=")){
    let index: number = 0;
    for(let i = 0; i < window.location.href.length; i++){
      if(window.location.href[i] === "="){
        index = i + 1;
        break;
      }
    }
    url = window.location.href.slice(index, window.location.href.length);
    entryFromUrl = window.location.href.slice(index, window.location.href.length);
  }

  // Set user inputs into the search bar and url (useful for history)
  function getInput(event: SyntheticEvent<HTMLInputElement>){
    let e = event.nativeEvent as CompositionEvent;
    showClearButton();
    if(e.data === null){
      setCurrentValue(prev => prev = prev.slice(0, -1));
    }
    else{
      setCurrentValue(prev => prev = prev + e.data);
    }
    window.history.pushState(null, "", `?entry=${searchValue.current!.value}`);
  }

  // Search for titles based on search bar value
  async function searchForTitle(){
    try{
      const searchInput: string = searchValue.current!.value.toLowerCase();
      const response = await fetch(`${process.env.REACT_APP_SERVE_ME}/api/games/search?entry=${searchInput.length === 0 || searchInput[0] === " " ? "{Empty}" : searchInput}`,{
        method: 'get'
      });
      await response.json()
      .then(title=>{
        titlesArr = title;
        clearFiltersArr();
        appendTitles();
      });
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    setCurrentValue(prev => prev = url);
    const clearButtonTimeout = setTimeout(showClearButton, 100);

    return()=>{
      clearTimeout(clearButtonTimeout);
    }
  },[url]);

  return(
    <div id='searchbar-container'>
      <input id='searchbar' autoFocus autoComplete='off' placeholder="Search for titles"  
            ref={searchValue} onKeyUp={searchForTitle} 
            value={currentValue}  onChange={getInput}/>
      {clear}
    </div>
  );
}

// All Filters and filter overlay.
type FilterProps = {
  appendTitles: Function,
  titles: TypeGame[] | null,
}
// All written in the same order, except overlay.
function Tags({appendTitles, titles}: FilterProps){
  // Variables
  const filter = useRef<HTMLUListElement | null>(null);
  const filterBg = useRef<HTMLDivElement | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  // Open the filter and some styling stuff
  function showFilter(){
    if(isSelectionOpen === false){
      isSelectionOpen = true;
      filter.current!.classList.remove('hidden');
      filterBg.current!.style.border = "2px solid rgba(107, 107, 107, 1)";
    }
    else{
      isSelectionOpen = false;
      Array.from(document.getElementsByClassName('custom-selections') as HTMLCollectionOf<HTMLUListElement>).forEach(element =>{
        element.classList.add('hidden');
      });
      Array.from(document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLDivElement>).forEach(element =>{
        element.style.cssText = "";
      });
    }
  }

  // Filter titles based on selected filters
  function applyFilter(event: React.ChangeEvent<HTMLInputElement>){
    const value = event.target.value;
    if(event.target.checked){
      filterArrays.genre.push(value);
    }
    else{
      const newArr = filterArrays.genre.filter((genre)=>{
        if(genre.includes(value)){
          return false;
        }
        else{
          return true;
        }
      });
      filterArrays.genre = newArr;
    }
    appendTitles();
  }

  useEffect(()=>{
    // Append the filters of the current titles on the page
    function setRetrievedTags(){
      // Check for dupes
      if(titlesArr !== null && titlesArr.length > 0){
        let allTags = [];
        for(let i = 0; i < titlesArr.length; i++){
          for(let j = 0; j < titlesArr[i]!.tags.length; j++){
            if(allTags.includes(titlesArr[i]!.tags[j]) === false){
              allTags.push(titlesArr[i]!.tags[j]);
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

function Platforms({appendTitles, titles}: FilterProps){
  // Variables
  const filter = useRef<HTMLUListElement | null>(null);
  const filterBg = useRef<HTMLDivElement | null>(null);
  const [platforms, setPlatforms] = useState<string[]>([]);
  
  function showFilter(){
    if(isSelectionOpen === false){
      isSelectionOpen = true;
      filter.current!.classList.remove('hidden');
      filterBg.current!.style.border = "2px solid rgba(107, 107, 107, 1)";
    }
    else{
      isSelectionOpen = false;
      Array.from(document.getElementsByClassName('custom-selections') as HTMLCollectionOf<HTMLUListElement>).forEach(element =>{
        element.classList.add('hidden');
      });
      Array.from(document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLDivElement>).forEach(element =>{
        element.style.cssText = "";
      });
    }
  }

  // Filter titles based on selected filters
  function applyFilter(event: React.ChangeEvent<HTMLInputElement>){
    const value = event.target.value;
    if(event.target.checked){
      filterArrays.platforms.push(value);
    }
    else{
      const newArr = filterArrays.platforms.filter((platform)=>{
        if(platform.includes(value)){
          return false;
        }
        else{
          return true;
        }
        });
        filterArrays.platforms = newArr;
    }
    appendTitles();
  }
  

useEffect(()=>{
  // Show filters based on titles retrieved from database
  function setRetrievedPlatforms(){
    if(titlesArr !== null && titlesArr.length > 0){
      let allPlatforms = [];
      for(let i = 0; i < titlesArr.length; i++){
        for(let j = 0; j < titlesArr[i]!.platforms.length; j++){
          if(allPlatforms.includes(titlesArr[i]!.platforms[j]) === false){
            allPlatforms.push(titlesArr[i]!.platforms[j]);
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

function Year({appendTitles, titles}: FilterProps){
  // Variables
  const filter = useRef<HTMLUListElement | null>(null);
  const filterBg = useRef<HTMLDivElement | null>(null);
  const [year, setYear] = useState<string[]>([]);

  function showFilter(){
    if(isSelectionOpen === false){
      isSelectionOpen = true;
      filter.current!.classList.remove('hidden');
      filterBg.current!.style.border = "2px solid rgba(107, 107, 107, 1)";
    }
    else{
      isSelectionOpen = false;
      Array.from(document.getElementsByClassName('custom-selections') as HTMLCollectionOf<HTMLUListElement>).forEach(element =>{
        element.classList.add('hidden');
      });
      Array.from(document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLDivElement>).forEach(element =>{
        element.style.cssText = "";
      });
    }
  }

  // Apply the selected filter(s)
  function applyFilter(event: React.ChangeEvent<HTMLInputElement>){
    const value = event.target.value;
    if(event.target.checked){
      filterArrays.year.push(value);
    }
    else{
      const newArr = filterArrays.year.filter((year)=>{
        if(year.includes(value)){
          return false;
        }
        else{
          return true;
        }
      });
      filterArrays.year = newArr;
    }
    appendTitles();
  }

useEffect(()=>{
  // Show filters based on retrieved titles from database
  function setRetrievedReleaseDates(){
    if(titlesArr !== null && titlesArr.length > 0){
      let allDates = [];
      for(let j = 0; j < titlesArr.length; j++){
        if(allDates.includes(titlesArr[j]!.releaseDate.slice(6, 10)) === false){
          allDates.push(titlesArr[j]!.releaseDate.slice(6, 10));
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
  const filterOverlay = useRef<HTMLDivElement | null>(null);

  function closeFilters(){
    if(isSelectionOpen){
      Array.from(document.getElementsByClassName('custom-selections') as HTMLCollectionOf<HTMLUListElement>).forEach(element =>{
        element.classList.add('hidden');
      });
      Array.from(document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLDivElement>).forEach(element =>{
        element.style.cssText = "";
        
      })
      filterOverlay.current!.classList.add('hidden');
      isSelectionOpen = false;
    }
  }

  return(
    <div id="transparent-overlay"
        ref={filterOverlay} onClick={closeFilters}>
    </div>
  ); 
}

function Publishers({appendTitles, titles}: FilterProps){
  const [publishers, setPublishers] = useState<string[]>([]);
  const filter = useRef<HTMLUListElement | null>(null);
  const filterBg = useRef<HTMLDivElement | null>(null);

  function showFilter(){
    if(isSelectionOpen === false){
      isSelectionOpen = true;
      filter.current!.classList.remove('hidden');
      filterBg.current!.style.background = "rgb(0, 6, 12)";
      filterBg.current!.style.border = "2px solid rgba(107, 107, 107, 1)";
    }
    else{
      isSelectionOpen = false;
      Array.from(document.getElementsByClassName('custom-selections') as HTMLCollectionOf<HTMLUListElement>).forEach(element =>{
        element.classList.add('hidden');
      });
      Array.from(document.getElementsByClassName('filters') as HTMLCollectionOf<HTMLDivElement>).forEach(element =>{
        element.style.cssText = "";
      });
    }
  }

  // Apply selected filter(s)
  function applyFilter(event: React.ChangeEvent<HTMLInputElement>){
    const value = event.target.value;
    if(event.target.checked){
          filterArrays.publishers.push(value);
    }
    else{
      const newArr = filterArrays.publishers.filter((publisher)=>{
        if(publisher.includes(value)){
          return false;
        }
        else{
          return true;
        }
      });
      filterArrays.publishers = newArr;
    }
    appendTitles();
  }
   
  useEffect(() =>{
    // Show filters based on retrieved titles from database
    function setRetrievedPublishers(){
      const titleArr = titlesArr;
      const allPublishers: string[] = [];
      if(titleArr !== null && titleArr.length > 0){
        for(let i = 0; i < titleArr.length; i++){
          if(!allPublishers.includes(titleArr[i]!.publisher)){
            allPublishers.push(titleArr[i]!.publisher);
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
  const [filterOverlay, setfilterOverlay] = useState<JSX.Element | null>(null);
  const [searchedTitles, setSearchedTitles] = useState<TypeGame[] | null>(null);
  const [returnTitles, setReturnTitles] = useState<JSX.Element[] | null>(null);
  const [isAwake, setIsAwake] = useState<boolean | undefined>(false);

  // Global function, checks if a filter is open and opens the filter if so.
  function openFilterOverlay(){
    if(isSelectionOpen){
      setfilterOverlay(prev => prev = <FilterOverlay />);
      document.querySelector('body')!.style.overflow = "hidden";
    }
    else{
      setfilterOverlay(prev => prev = null);
      document.querySelector('body')!.style.cssText = "";
    }  
  }

  // Append the titles and/or filtered titles to the page.
  function appendSearchedTitles(){
    const titles: TypeGame[] = [];

    // Filter the retrieved titles from database based on the selected filters.
    // *Declare counters to compare with the length of the arrays of "filtersArr" (look at imports).*
    for(let j = 0; j < titlesArr.length; j++){
      let containsYear = 0;
      let containsGenre = 0;
      let containsPlatform = 0; 
      let containsPublisher = 0;

      // *Update counters*
      (function (){
        for(let i = 0; i < filterArrays.genre.length; i++){
          if(titlesArr[j]!.tags.includes(filterArrays.genre[i])){
                containsGenre++;
          }
        }
        for(let i = 0; i < filterArrays.year.length; i++){
          if(titlesArr[j]!.releaseDate.includes(filterArrays.year[i])){
            containsYear++;
          }
        }
        for(let i = 0; i < filterArrays.platforms.length; i++){
          if(titlesArr[j]!.platforms.includes(filterArrays.platforms[i])){
            containsPlatform++;
          }
        }
        for(let i = 0; i < filterArrays.publishers.length; i++){
          if(titlesArr[j]!.publisher.includes(filterArrays.publishers[i])){
            containsPublisher++;
          }
        } 
      })();

    // *Append filtered titles (if the filters array aren't empty)*
      if((filterArrays.year.length > 0 || filterArrays.genre.length > 0
        || filterArrays.platforms.length > 0 || filterArrays.publishers.length > 0)
          && (containsGenre === filterArrays.genre.length && containsYear === filterArrays.year.length)
          && containsPlatform === filterArrays.platforms.length && containsPublisher === filterArrays.publishers.length){
              
          titles!.push(titlesArr[j]);
           containsYear = 0;
           containsGenre = 0;
           containsPlatform = 0;
           containsPublisher = 0;
      }
      // Append all titles (if filter arrays are empty)
      else if(filterArrays.year.length === 0 && filterArrays.genre.length === 0 
              && filterArrays.platforms.length === 0 && filterArrays.publishers.length === 0){
                    
                titles!.push(titlesArr[j]);
      } 
  }
  setSearchedTitles(prev => prev = titles); // *Change page state (Titles)* 
} 
 
useEffect(()=>{
  async function checkServer(){
    const response = await wakeUp();
    setIsAwake(prev => prev = response);
  }
  checkServer();
});

  // Get titles based on URL and append to page
  useEffect(()=>{
    async function getTitles(){
      const response = await fetch(entryFromUrl !== "" ? `${process.env.REACT_APP_SERVE_ME}/api/games/search?entry=${entryFromUrl}` : `${process.env.REACT_APP_SERVE_ME}/api/games/search?entry={Empty}`);
      const data = await response.json();
      titlesArr = data;
      setSearchedTitles(prev => prev = titlesArr);
    }

    if(isAwake) getTitles();

    return()=>{
      setSearchedTitles(prev => prev = null);
    }

  }, [isAwake]);

  function noBodyScroll(){
    document.querySelector("body")!.style.overflow = "hidden";
  }

  // Create titles element
  useEffect(()=>{
    if(searchedTitles){
      const searchedGames: JSX.Element[] = retrievedTitles();
      setReturnTitles(prev => prev = searchedGames);
    }

    return()=>{
      setReturnTitles(prev => prev = null);
    }
  }, [searchedTitles])

  function retrievedTitles():JSX.Element[]{
    const titles:JSX.Element[] = searchedTitles!.map(game=>
      <div key={game!.id} className="searched-title-container">
        <Link className='searched-title-image-container' to={`/info?title=${game!.id}`}>
          <img src={game!.imgURL} alt="Poster" className="searched-title-image"></img>
        </Link>
        <div className='searched-title-title-container'>
        </div>
      </div>)
      return titles;
  }
 
  return (
    <main id="search-page-bg" onClick={openFilterOverlay}>
      <div id="search-page">
        <Header item={<SearchBar appendTitles={appendSearchedTitles} />}/>
        <div id="game-filters-container">
          <Year appendTitles={appendSearchedTitles} titles={searchedTitles}/>
          <Tags appendTitles={appendSearchedTitles} titles={searchedTitles}/>
          <Platforms appendTitles={appendSearchedTitles} titles={searchedTitles}/>
          <Publishers appendTitles={appendSearchedTitles} titles={searchedTitles}/>
        </div>
          <section id="searched-titles" onScroll={noBodyScroll}>
            {searchedTitles ? returnTitles : <Loader />}
          </section>
      </div>
      {filterOverlay}
    </main>
  );
}
  
export default App;