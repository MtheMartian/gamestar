export interface SearchPage{
  isSelectionOpen: boolean,
  foundTitles: Array<{}>,
}

export const mainPageOptions = {
  isSelectionOpen: false,
  foundTitles: [{
    tags: [""],
    platforms: [""],
    releaseDate: "",
    publisher: "",
    imgURL: "",
    id: "",
    title: "",
  }],
} 

export const filtersArr: {[key: string]: string[],
  year: string[],
  genre: string[],
  platforms: string[],
  publishers: string[]
} = {year: [], genre: [], platforms: [], publishers: []};
