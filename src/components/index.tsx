import styled from "styled-components";
import React from "react";
import { useHistory } from "react-router";
import breakPoints from "styled-breakpoints";

export const AppTitleBar = styled.section`
  align-items: center;
  background: ${(props) => props.theme.colors.primary};
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 2px 9px 1px rgba(0, 0, 0, 0.12),
    0 4px 2px -2px rgba(0, 0, 0, 0.2);
  color: ${(props) => props.theme.colors.fg};
  display: flex;
  font-size: 20px;
  font-weight: 500;
  height: ${(props) => props.theme.variables.headerHeight};
  left: 0;
  padding-left: ${(props) => props.theme.spaceUnit(1)};
  ${breakPoints.up("xl")} {
    padding-left: ${(props) => props.theme.spaceUnit(3)};
    padding-right: ${(props) => props.theme.spaceUnit(3)};
  }
  position: sticky;
  right: 0;
  top: 0;
  z-index: 1;
`;
export const Refresh = styled(
  ({ onRefresh, className }: { onRefresh: () => void; className?: string }) => (
    <svg
      id="refresh"
      className={className}
      role="button"
      onClick={onRefresh}
      onTouchEnd={onRefresh}
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  )
)`
  cursor: pointer;
`;

export const Back = styled(({ className }) => {
  const history = useHistory();
  return (
    <svg
      id="back"
      onClick={() => history.goBack()}
      className={className}
      onTouchEnd={() => history.goBack()}
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
})`
  cursor: pointer;
`;

export const AppTitle = styled.div`
  flex: 1;
  margin-right: ${(props) => props.theme.spaceUnit(1)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const CardContainer = styled.article`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${(props) => props.theme.spaceUnit(1 / 2)};
`;
type CardProps = { disabled?: boolean };
export const Card = styled.div<CardProps>`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  height: 225px;
  margin: ${(props) => props.theme.spaceUnit(1 / 2)};
  max-width: 100%;
  position: relative;
  width: 300px;
  display: flex;

  ${breakPoints.down("sm")} {
    height: 180px;
    width: 240px;
  }

  img {
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
    max-width: 100%;
    position: absolute;
    height: auto;
    max-height: 100%;
    align-self: center;
    justify-self: center;
    margin: auto;
  }

  &:hover {
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  }
`;
export const Select = styled.select`
  display: block;
  font-size: 16px;
  font-family: sans-serif;
  font-weight: 700;
  color: #444;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.5em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;

  &:hover {
    border-color: #888;
  }
  &:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }

  & option {
    font-weight: normal;
  }

  &:disabled {
    color: graytext;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22graytext%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
      linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  }

  &:disabled:hover {
    border-color: #aaa;
  }
`;
