
export interface Movie {
  movie_id: number;
  title: string;
  description?: string;
  duration: number;                 // minutes
  genre?: string[];
  language?: string[];
  release_date?: string;            // ISO string from backend
  rating?: number;
  certificate?: string;
  poster_url?: string;
  background_image_url?: string;
  is_active: boolean;
  cast?: any;                       // JSON -> any or custom type
  crew?: any; 
  format?:string[];                      // JSON -> any or custom type
}