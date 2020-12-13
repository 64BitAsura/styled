import "@testing-library/jest-dom";

import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import App from "./application";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  // @ts-ignore
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

it("renders My list", () => {
  render(<App />);
  expect(screen.getByText("Movies")).toBeInTheDocument();
  expect(screen.getByText("Books")).toBeInTheDocument();
  expect(screen.getByText("Songs")).toBeInTheDocument();
});

it("renders My Movies", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/Movies/i));
  expect(screen.getByTestId("genre_title")).toBeInTheDocument();
});

it("renders My Movies placeholder cards", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/Movies/i));
  expect(screen.getAllByTestId("placeholder-card")?.[0]).toBeInTheDocument();
});

it("renders My Movies movie cards", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/Movies/i));
  await waitFor(() => screen.getAllByTestId("movie-card"));
  expect(screen.getAllByTestId("movie-card")?.[0]).toBeInTheDocument();
});

it("renders My Movies genre list", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/Movies/i));
  await waitFor(() => screen.getAllByTestId("movie-card"));
  await waitFor(() => screen.getAllByTestId("genre-list-option"));
  expect(screen.getAllByTestId("genre-list-option")?.[1]).toBeInTheDocument();
});

const GENRE_ACTION_ID = 28;
it("renders My Movies movie cards after genre change", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/Movies/i));
  await waitFor(() => screen.getAllByTestId("movie-card"));
  await waitFor(() => screen.getAllByTestId("genre-list-option"));
  fireEvent.change(screen.getByTestId("genre-list"), {
    target: { value: GENRE_ACTION_ID }
  });
  expect(screen.getAllByTestId("placeholder-card")?.[0]).toBeInTheDocument();
  await waitFor(() => screen.getAllByTestId("movie-card"));
  expect(screen.getAllByTestId("movie-card")?.[0]).toBeInTheDocument();
  expect(mockHistoryPush).toBeCalledWith(`/movies/genre/${GENRE_ACTION_ID}`);
});

const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui);
};

const GENRE_POPULAR_ID = 0;
it("renders My Movies movie cards from genre url", async () => {
  renderWithRouter(<App />, { route: `/movies/genre/${GENRE_POPULAR_ID}` });
  await waitFor(() => screen.getAllByTestId("movie-card"));
  expect(mockHistoryPush).toBeCalledWith(`/movies/genre/${GENRE_POPULAR_ID}`);
  await waitFor(() => screen.getAllByTestId("genre-list-option"));
  fireEvent.change(screen.getByTestId("genre-list"), {
    target: { value: GENRE_ACTION_ID }
  });
  expect(screen.getAllByTestId("placeholder-card")?.[0]).toBeInTheDocument();
  await waitFor(() => screen.getAllByTestId("movie-card"));
  expect(screen.getAllByTestId("movie-card")?.[0]).toBeInTheDocument();
});

const DISCOVER_KEYWORD = "peace";
it("renders My Movies movie cards from discover url", async () => {
  renderWithRouter(<App />, { route: `/movies/discover/${DISCOVER_KEYWORD}` });
  await waitFor(() => screen.getAllByTestId("discover-title"));
  await waitFor(() => screen.getAllByTestId("placeholder-card"));
  await waitFor(() => screen.getAllByTestId("movie-card"));
  await waitFor(() => screen.getAllByTestId("genre-list-option"));
  fireEvent.change(screen.getByTestId("genre-list"), {
    target: { value: GENRE_ACTION_ID }
  });
  expect(screen.getAllByTestId("placeholder-card")?.[0]).toBeInTheDocument();
  await waitFor(() => screen.getAllByTestId("movie-card"));
  expect(screen.getAllByTestId("movie-card")?.[0]).toBeInTheDocument();
  expect(mockHistoryPush).toBeCalledWith(`/movies/genre/${GENRE_ACTION_ID}`);
});
