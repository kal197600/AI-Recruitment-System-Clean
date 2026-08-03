// frontend2/src/theme/index.js

import { createTheme } from "@mui/material/styles";

import palette from "./palette";
import typography from "./typography";
import shadows from "./shadows";
import shape from "./shape";
import spacing from "./spacing";
import components from "./components";

let theme = createTheme({
  palette,
  typography,

  shape: {
    borderRadius: shape.borderRadius,
    ...shape,
  },

  spacing: spacing.base,
});

theme = createTheme(theme, {
  components: components({
    palette: theme.palette,
    typography: theme.typography,
    shadows,
    shape,
    spacing,
    theme,
  }),
});

export default theme;