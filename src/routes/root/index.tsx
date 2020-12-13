import { AppTitle, AppTitleBar, Card, CardContainer } from "../../components";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const CategoryTitle = styled.span`
  font-size: 2em;
  align-self: center;
  justify-self: center;
  margin: auto;
  cursor: pointer;
  position: relative;
  color: ${(props) => props.theme.colors.fg};
`;

export const Root = () => {
  return (
    <>
      <AppTitleBar>
        <AppTitle>My List</AppTitle>
      </AppTitleBar>
      <CardContainer>
        <Link to={"/movies"}>
          <Card>
            <img src={"./images/movie.jpg"} />
            <CategoryTitle>Movies</CategoryTitle>
          </Card>
        </Link>
        <Link to={"/books"}>
          <Card>
            <img src={"./images/book.jpg"} />
            <CategoryTitle>Books</CategoryTitle>
          </Card>
        </Link>
        <Link to={"/songs"}>
          <Card>
            <img src={"./images/song.jpg"} />
            <CategoryTitle>Songs</CategoryTitle>
          </Card>
        </Link>
      </CardContainer>
    </>
  );
};
