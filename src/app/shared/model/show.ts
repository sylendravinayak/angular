export interface ShowOut {
  show_id: number;
  movie_id: number;
  screen_id: number;
  show_date: string; // YYYY-MM-DD
  show_time: string; // HH:mm:ss (or whichever format your backend returns)
  end_time?: string;
  status?: string;
  format?: string;
  language?: string; // backend may return array for movie.languages
}

export interface ShowSummary {

  show_date: string;
  show_time: string;
  screen_name: string;
  movie_title: string;
  movie_poster: string;
  // add any other fields you need
}