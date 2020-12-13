const spaceUnitInPixel = 16;
export default {
  colors: {
    primary: "#2196F3",
    background: "#E3F2FD",
    fg: "#ffffff"
  },
  variables: {
    headerHeight: "56px"
  },
  spaceUnit: (multiple: number) => `${spaceUnitInPixel * multiple}px`
};
