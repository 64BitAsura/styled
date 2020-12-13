import {
  AppTitle,
  AppTitleBar,
  Back,
  Card,
  CardContainer,
  Refresh,
  Select
} from "../../components";
import React, { useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ActorRefFrom, StateMachine } from "xstate";
import {
  GENRE_POPULAR_ID,
  MovieEvent,
  MovieMachineContext
} from "./movieMachine";
import GenreMachine from "./genreMachine";
import { useActor, useMachine } from "@xstate/react";
import styled from "styled-components";

const MovieCard = styled(Card)`
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 5px;
  flex-direction: column;
  &:hover {
    transform: scale(1.3);
    z-index: 100;
  }
  & .placeholderbox {
    width: calc(100% - 10%);
    height: calc(100% - 10%);
    margin: auto;
    border-radius: 5px;
  }
  & .placeholder {
    display: inline-block;
    background-color: #b0c0c7;
    animation-name: shine;
    animation-duration: 2.4s;
    animation-iteration-count: infinite;
  }

  @keyframes shine {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
    100% {
      opacity: 1;
    }
  }
`;

const MovieBanner = styled.div<{ backdropPath: string }>`
  background: url(https://image.tmdb.org/t/p/w500${(props) =>
      props.backdropPath}?api_key=${process.env.REACT_APP_MOVIE_DB_API_KEY}),
    linear-gradient(to bottom, #b0c0c778, #b0c0c778);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  flex-grow: 1;
`;

const Popular = styled.div`
  align-self: flex-end;
  height: 20px;
  width: 100%;
  background-color: #000000;
  color: ${(props) => props.theme.colors.fg};
  text-align: left;
`;

const Genre = styled.section`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-top: 20px;
`;

const ListTitle = styled.span`
  font-size: 3em;
`;

const GenreList = styled(Select)`
  width: 200px;
`;

const Discover = styled.input.attrs({ type: "text" })`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: none;
  background-color: ${(props) => props.theme.colors.fg};
  color: #000;
  width: 200px;
  margin-right: 16px;
`;

const MoviesContainer = styled(CardContainer)`
  justify-content: center;
`;

export const Movies = ({
  service
}: {
  service: ActorRefFrom<StateMachine<MovieMachineContext, any, MovieEvent>>;
}) => {
  const history = useHistory();
  const { genreId, discover } = useParams<{
    genreId?: string;
    discover?: string;
  }>();
  const [current, send] = useActor(service);
  const [genreCurrent] = useMachine(GenreMachine);
  const { lists, genre } = current.context;
  useEffect(() => {
    discover == null &&
      send({ type: "CHANGE_GENRE", id: parseInt(genreId ?? "0") });
  }, []);
  useEffect(() => {
    (discover == null || (discover != null && genreId == null && genre > 0)) &&
      history.push(`/movies/genre/${genre}`);
  }, [genre]);
  useEffect(() => {
    discover != null && send({ type: "SEARCH_KEYWORD", key: discover });
  }, [discover]);
  const onDiscoverRequest = useCallback(
    ({ target: { value }, key }) =>
      key === "Enter" && history.push(`/movies/discover/${value}`),
    []
  );
  return (
    <>
      <AppTitleBar>
        <Back />
        <AppTitle>My Movies</AppTitle>
        <Discover placeholder={"discover"} onKeyDown={onDiscoverRequest} />
        <Refresh onRefresh={() => send({ type: "REFRESH" })} />
      </AppTitleBar>
      <Genre>
        <GenreList
          data-testid={"genre-list"}
          onChange={(e) => {
            send({ type: "CHANGE_GENRE", id: parseInt(e.target.value) });
          }}
        >
          <option
            data-testid={"genre-list-option"}
            key={GENRE_POPULAR_ID}
            value={GENRE_POPULAR_ID}
          >
            Popular
          </option>
          {genreCurrent.context.genres.map((genre) => (
            <option
              data-testid={"genre-list-option"}
              key={genre.id}
              value={genre.id}
            >
              {genre.name}
            </option>
          ))}
        </GenreList>
        {discover && (
          <ListTitle data-testid={"discover-title"}>
            Search Keyword: {discover}
          </ListTitle>
        )}
        {genreId && (
          <ListTitle data-testid={"genre_title"}>
            {genreCurrent.context.genres.filter(
              (_genre) => _genre.id === genre
            )?.[0]?.name ?? "Popular"}
          </ListTitle>
        )}
      </Genre>
      <MoviesContainer>
        {current.matches("loading") &&
          new Array(30).fill(0).map((_, index) => (
            <MovieCard key={index} data-testid={"placeholder-card"}>
              <div className={"placeholderbox placeholder"} />
            </MovieCard>
          ))}
        {lists[genre] &&
          lists[genre]?.pages[1]?.map((movie) => (
            <MovieCard data-testid={"movie-card"} key={movie.id}>
              <MovieBanner backdropPath={movie.poster_path} />
              <Popular>
                <span style={{ paddingLeft: 16 }}>
                  Vote: {movie.vote_average}
                </span>
              </Popular>
            </MovieCard>
          ))}
      </MoviesContainer>
    </>
  );
};
