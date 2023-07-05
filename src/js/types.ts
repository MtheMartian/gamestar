export type GeneralType = {
  game: {
    tags: string[],
    platforms: string[],
    releaseDate: string,
    publisher: string,
    imgURL: string,
    consoleLinks: {xbox: string, pStore: string, nintendo: string},
    pcLinks: {steam: string, epicStore: string}, summary: string,
    videoURL: string,
    gameplayVid: string,
    id: string,
    gameTitle: string
  } | null,
  
  review:{
    displayName: string,
    gameReview: string,
    whenPosted: string
  }
}

export type Filters = {
  filters: {
    [key: string] : string[],
    year: string[],
    genre: string[],
    platforms: string[],
    publishers: string[]
  }
}

export type TypeGame = GeneralType["game"];
export type TypeFilters = Filters["filters"];
export type TypeReview = GeneralType["review"];