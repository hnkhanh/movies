export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
}

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export enum ViewMode {
  List = 'list',
  Grid = 'grid',
}
export enum Tab {
  NowPlaying,
  TopRated,
}
