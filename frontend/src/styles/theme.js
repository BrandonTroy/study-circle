import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#358ce3',
      dark: '#1061b1',
    },
    secondary: {
      main: '#7b63fb',
      light: '#917cff',
      dark: '#644edb',
    },
    background: {
      default: '#fff',
    },
  },
  popup: {
    width: '30rem',
    border: '1px solid darkgrey'
  }
});

theme.palette.highlight = {
  main: alpha(theme.palette.primary.main, 0.15),
  light: alpha(theme.palette.primary.light, 0.15),
  dark: alpha(theme.palette.primary.dark, 0.15)
};

const globalStyles = {
  '&::-webkit-scrollbar': {
    width: '12px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    // background: '#e7e7e7',
    background: 'transparent',
    borderRadius: '1000px',
    border: '3px solid white'
  },
  '&:hover::-webkit-scrollbar-thumb': {
    background: 'rgba(150 150 150 / 0.5)',
  },
};

const scrollBarWidth = 10;

export { theme, globalStyles, scrollBarWidth };
