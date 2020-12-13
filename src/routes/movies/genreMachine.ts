import { assign, DoneInvokeEvent, Machine } from "xstate";
import { Genre } from "./schema";

const invokeFetchGenres = (): Promise<Genre[]> => {
  return fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_MOVIE_DB_API_KEY}`
  )
    .then((response) => response.json())
    .then(({ genres }: { genres: Genre[] }) => genres);
};

interface GenreSchema {
  states: {
    loading: {};
    loaded: {};
    failure: {};
  };
}

interface GenreMachineContext {
  genres: Genre[];
}

type GenreMachineEvent = { type: "REFRESH" } | { type: "RETRY" };

export default Machine<GenreMachineContext, GenreSchema, GenreMachineEvent>({
  id: "genre",
  initial: "loading",
  context: {
    genres: []
  },
  states: {
    loading: {
      invoke: {
        id: "fetchGenres",
        src: invokeFetchGenres,
        onDone: {
          target: "loaded",
          actions: assign<GenreMachineContext, DoneInvokeEvent<Genre[]>>({
            genres: (_, event) => event.data
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
  }
});
