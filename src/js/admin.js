 export const titleOptions = {
  storeTitle: null,
  openEdit: false,
  searchedTitles: null,
 }
 
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


