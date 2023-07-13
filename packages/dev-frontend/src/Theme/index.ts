import { extendTheme } from "@chakra-ui/react";

import textStyles from "./textStyles";
import layerStyles from "./layerStyles";
import colors from "./colors";
import components from "./Components";
import radii from "./radii";
import preon from "./preon";
import sizes from "./sizes";
import breakpoints from "./breakpoints";

const theme = extendTheme({
  breakpoints,
  colors,
  textStyles,
  layerStyles,
  components,
  radii,
  sizes,
  preon
});

export default theme;
