import { createTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';

export const theme = createTheme({
  palette: {
    type: 'dark',
    primary: orange,
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  overrides: {
    MuiSelect: {
      icon: {
        top: 'calc(50% - 0.8rem)',
      },
      select: {
        textAlign: 'left',
      },
    },
  },
});
