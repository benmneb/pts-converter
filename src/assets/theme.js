import { createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: orange
  },
  typography: {
    fontSize: 20,
    fontFamily: ['Inter', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
});