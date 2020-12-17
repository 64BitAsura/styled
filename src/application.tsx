import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, useParams } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import theme from "./theme";
import { useMachine } from "@xstate/react";
import { inspect } from "@xstate/inspect";
import { MyListMachine } from "./routes/machine";
import { AppTitleBar, CardContainer } from "./components";

const GlobalStyleComponent = createGlobalStyle`
  body{
   font-size: 16px;
   margin: 0;
   font-family: source_code, Serif;
  }
  svg{
    position: relative;
    margin-right: 16px;
    fill: ${(props) => props.theme.colors.fg};
  }
  @font-face {
    font-family: "source_code";
    src: local("source_code"),url(/fonts/source_code.ttf) format("truetype")
  }
  a{
   text-decoration: none;
   color: inherit;
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

const MoviesLazy = lazy(() => import("./routes/movies"));
const BooksLazy = lazy(() => import("./routes/books"));
const SongsLazy = lazy(() => import("./routes/songs"));
const RootLazy = lazy(() => import("./routes/root"));

const AppHeaderPlaceHolder = styled(AppTitleBar)`
  background-color: #b0c0c7;
  animation-name: shine;
  animation-duration: 2.4s;
  animation-iteration-count: infinite;
`;

const AppContainer = styled(CardContainer)`
  background-color: #b0c0c7;
  animation-name: shine;
  animation-duration: 2.4s;
  animation-iteration-count: infinite;
`;

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});

const AppShell = styled(({ className }: { className?: string }) => {
  const { subListId } = useParams<{ subListId?: string }>();
  const [current, send] = useMachine(MyListMachine);
  const { subList } = current.context;
  useEffect(() => {
    subListId && send("SELECT", { name: subListId });
  }, [subListId]);
  return (
    <article className={className}>
      <Suspense
        fallback={
          <div>
            <AppHeaderPlaceHolder />
            <AppContainer />
          </div>
        }
      >
        <Route exact path={"/"}>
          <RootLazy />
        </Route>
        <Route path={"/songs"}>
          {subList && <SongsLazy service={subList} />}
        </Route>
        <Route
          path={[
            "/movies/discover/:discover",
            "/movies/genre/:genreId",
            "/movies"
          ]}
        >
          {subList && <MoviesLazy service={subList} />}
        </Route>
        <Route path={"/books"}>
          {subList && <BooksLazy service={subList} />}
        </Route>
      </Suspense>
    </article>
  );
})`
  width: 100vw;
  height: 100vh;
`;

export default () => (
  <BrowserRouter>
    <Route path={"/:subListId?"}>
      <ThemeProvider theme={theme}>
        <GlobalStyleComponent />
        <AppShell />
      </ThemeProvider>
    </Route>
  </BrowserRouter>
);
