import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import { theme } from './assets';
import { Footer, Header, Nav, Main } from './containers';
import './assets/styles.css';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Nav />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}
