import { grey } from '@material-ui/core/colors';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { createMuiTheme } from '@material-ui/core/styles';

// A theme with custom primary and secondary color.

const theme = createMuiTheme({
  drawerWidth: 240,
  palette: {
    primary: {
      main: '#2d2d2d',
      text: '#fff'
    },
    secondary: {
      light: grey[200],
      main: grey[400],
      dark: grey[600]
    },
    action: {
      active: lightBlue[500]
    },
    typography: {
      useNextVariants: true
    }
  }
} as unknown);
export type Theme = typeof theme;
export default theme;
