import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";


interface GenreResponseProps {
    id: number;
    name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
    title: string;
  }
  
  interface MovieProps {
    imdbID: string;
    Title: string;
    Poster: string;
    Ratings: Array<{
      Source: string;
      Value: string;
    }>;
    Runtime: string;
  }

interface MainProviderProps {
    children: ReactNode;
}

interface MainContextData {
    genres: GenreResponseProps[];
    movies: MovieProps[];
    selectedGenre:GenreResponseProps;
    selectedGenreId: number;
    handleClickButton: (id: number) => void;
}

const mainContext = createContext<MainContextData>({} as MainContextData);

export function MainProvider ({children}:MainProviderProps) {
    const [selectedGenreId, setSelectedGenreId] = useState(1);

    const [genres, setGenres] = useState<GenreResponseProps[]>([]);

    const [movies, setMovies] = useState<MovieProps[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

    useEffect(() => {
        api.get<GenreResponseProps[]>('genres').then(response => {
        setGenres(response.data);
        });
    }, []);

    useEffect(() => {
        api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
        setMovies(response.data);
        });

        api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
        setSelectedGenre(response.data);
        })
    }, [selectedGenreId]);

    function handleClickButton(id: number) {
        setSelectedGenreId(id);
    }

    return (
        <mainContext.Provider value={{genres, movies, selectedGenre, selectedGenreId, handleClickButton}}>
            {children}
        </mainContext.Provider>   
    );
}

export function useMain() {
    return useContext(mainContext);
}
