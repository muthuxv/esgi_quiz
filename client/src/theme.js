import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#4a19d2',
      },
      secondary: {
        main: '#ff00c3',
      },
      background: {
        default: '#ffffff',
      },
    },
    typography: {
      button: {
        fontFamily: 'Montserrat',
      },
      body2: {
        fontFamily: 'Montserrat',
      },
      fontFamily: 'Montserrat',
    },
  });

export default theme;