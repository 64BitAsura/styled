import React, { useEffect } from "react";
import { BrowserRouter, Route, useParams } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import theme from "./theme";
import { Root } from "./routes/root";
import { Songs } from "./routes/songs";
import { Movies } from "./routes/movies";
import { Books } from "./routes/books";
import { useMachine } from "@xstate/react";
import { MyListMachine } from "./routes/machine";

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
`;

const AppShell = styled(({ className }: { className?: string }) => {
  const { subListId } = useParams<{ subListId?: string }>();
  const [current, send] = useMachine(MyListMachine);
  const { subList } = current.context;
  useEffect(() => {
    send("SELECT", { name: subListId });
  }, [subListId]);
  return (
    <article className={className}>
      <Route exact path={"/"}>
        <Root />
      </Route>
      <Route path={"/songs"}>{subList && <Songs service={subList} />}</Route>
      <Route
        path={[
          "/movies/discover/:discover",
          "/movies/genre/:genreId",
          "/movies"
        ]}
      >
        {subList && <Movies service={subList} />}
      </Route>
      <Route path={"/books"}>{subList && <Books service={subList} />}</Route>
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
