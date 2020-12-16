import { Machine, assign, DoneInvokeEvent } from "xstate";
import { DiscoveryElement, Genre } from "./schema";

export const GENRE_POPULAR_ID = 0;
const invokeFetchMovies = (
  context: MovieMachineContext
): Promise<{
  page: number;
  results: DiscoveryElement[];
  total_pages: number;
}> => {
  const { genre, search } = context;
  const url =
    search != null
      ? `https://api.themoviedb.org/3/search/movie?query=${search}&api_key=${process.env.REACT_APP_MOVIE_DB_API_KEY}`
      : genre > GENRE_POPULAR_ID
      ? `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_genres=${genre}&api_key=${process.env.REACT_APP_MOVIE_DB_API_KEY}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_MOVIE_DB_API_KEY}`;
  return fetch(url).then((response) => response.json());
};

interface MovieMachineSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

export interface MovieMachineContext {
  lists: {
    [genreKey: number]: {
      lastUpdated: Date;
      pages: { [page: number]: DiscoveryElement[] };
      total_pages: number;
    };
  };
  genre: number;
  search: string | null;
}

export type MovieEvent =
  | { type: "CHANGE_GENRE"; id: number }
  | { type: "SEARCH_KEYWORD"; key: string }
  | { type: "RETRY" }
  | { type: "REFRESH" };

export const createMovieMachine = () => {
  return Machine<MovieMachineContext, MovieMachineSchema, MovieEvent>({
    id: "movies",
    initial: "loading",
    context: {
      lists: {},
      genre: GENRE_POPULAR_ID,
      search: null
    },
    states: {
      loading: {
        invoke: {
          id: "fetch-popular-movies",
          src: invokeFetchMovies,
          onDone: {
            target: "loaded",
            actions: assign<
              MovieMachineContext,
              DoneInvokeEvent<{
                page: number;
                results: DiscoveryElement[];
                total_pages: number;
              }>
            >({
              lists: (context, event) => {
                return {
                  ...context.lists,
                  [context.genre]: {
                    lastUpdated: new Date(Date.now()),
                    pages: {
                      ...(context.lists[context.genre]?.pages ?? {}),
                      [event.data.page]: event.data.results
                    },
                    total_pages: event.data.total_pages
                  }
                };
              }
            })
          },
          onError: "failure"
        }
      },
      loaded: {
        on: {
          REFRESH: "loading"
        }
      },
      failure: {
        on: {
          RETRY: "loading"
        }
      }
    },
    on: {
      CHANGE_GENRE: {
        target: "loading",
        actions: assign((context, event) => {
          return {
            ...context,
            search: null,
            genre: event.id
          };
        })
      },
      SEARCH_KEYWORD: {
        target: "loading",
        actions: assign((context, event) => {
          return {
            ...context,
            search: event.key
          };
        })
      }
    }
  });
};
