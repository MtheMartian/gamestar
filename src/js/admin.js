 export const titleOptions = {
  storeTitle: null,
  openEdit: false,
  searchedTitles: null,
 }

 // Variables

 // Routes
 export async function getTitles(){
  try{
    const response = await fetch('/admintools.gamesportal/gettitles', {
      method: 'get',
    });
    const data = await response.json();
    console.log(data);
    return data;
  }
  catch(err){
    console.log(err);
  }
};

export async function getSpecificTitle(event){
  console.log(event);
  const title = event.target.id;
  try{
    const response = await fetch(`/admintools.gamesportal/getthistitle/${title}`,{
      method: 'get',
    });
    const data = await response.json();
    console.log(data);
    titleOptions.storeTitle = data;
    titleOptions.openEdit = true;
  }
  catch(err){
    console.log(err);
  }
}

export async function searchTitles(){
  const input = document.getElementById('search-titles').value;
  try{
    const response = await fetch(`/admintools.gamesportal/search?entry=${input.toLowerCase()}`,{
      method: "GET",
    });
    const data = await response.json();
    titleOptions.searchedTitles = data;
  }
  catch(err){
    console.log(err);
  }
}

export async function getCarouselTitles(){
  try{
    const response = await fetch(`${process.env.REACT_APP_SERVE_ME}/api/games/carousel`, {
      method: 'get'
    });
    const data = await response.json();
    return data;
  }
  catch(err){
    console.log(`Uh Oh! Carousel titles aren't loading! ${err}`);
  }
}

export async function retrieveGames(){
  try{
    const response = await fetch(`${process.env.REACT_APP_SERVE_ME}/api/games`, {
      method: 'get'
    });
    const data = await response.json();
    return data;
  }
  catch(err){
    console.log(`Uh Oh! Couldn't retrieve the games! ${err}`);
  }
}

export async function wakeUp(){
    try{
      const response = await fetch(process.env.REACT_APP_SERVE_ME, {
        method: 'get',
        mode: "cors"
      });
      return response.ok;
    }
    catch(err){
      console.log(`Currently unable to contact the server. ${err}`);
    }
}

export async function getTitleInfo(gameId){
  try{
    const response = await fetch(`${process.env.REACT_APP_SERVE_ME}/api/games/info?title=${gameId}`);
    const data = await response.json();
    return data;
  }
  catch(err){
    console.log(`Uh Oh! Couldn't retrieve the game! ${err}`);
  }
}

export async function getReviews(gameId){
  try{
    const response = await fetch(`${process.env.REACT_APP_SERVE_ME}/api/reviews/${gameId}`);
    const data = await response.json();
    return data;
  }
  catch(err){
    console.log(`Uh Oh! Couldn't retrieve the reviews! ${err}`);
  }
}

export async function getSimilarGames(gameId){
  try{
    const response = await fetch(`${process.env.REACT_APP_SERVE_ME}/api/games/similar?gameId=${gameId}`);
    const data = await response.json();
    return data;
  }
  catch(err){
    console.log(`Uh Oh! Couldn't retrieve the games! ${err}`);
  }
}


