import * as React from 'react';
import {
  BrowserRouter, Routes, Route, NavLink, useParams,
} from 'react-router-dom';
import {
  extendTheme, ChakraProvider, CSSReset, Box,
} from '@chakra-ui/react';
import Home from './home';
import CreateGame from './create_game';
import JoinGame from './join_game';
import colors from '../styles';

const styles = {
  brand: {
    900: colors.backgroundColor,
    800: colors.accent1,
    700: colors.accent2,
    600: colors.accent3,
    500: colors.accent4,
  },
  config: {
    cssVarPrefix: 'cs52-kahoot',
  },
  global: {
    // styles for the `body`
    body: {
      bg: colors.backgroundColor,
      color: 'white',
    },
    // styles for the `a`
    a: {
      color: colors.accent3,
      _hover: {
        textDecoration: 'underline',
      },
    },
    form: {
      bg: colors.accent2,
      margin: '15px',
    },
    div: {
      padding: '20px',
      borderRadius: '8pt',
    },
    components: {
      FormLabel: {
        defaultProps: { _invalid: { textColor: 'red.100' } },
      },
      Form: {
        bg: colors.accent2,
      },
      Box: {
        bg: colors.accent3,
      },
    },
  },
};

const theme = extendTheme({ styles });

function Nav(props) {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" exact>Home</NavLink></li>
        <li><NavLink to="/create">New Game</NavLink></li>
        <li><NavLink to="/join">Join Game</NavLink></li>
        <li><NavLink to="/test/id2">test id2</NavLink></li>
      </ul>
    </nav>
  );
}

function Test(props) {
  const { id } = useParams();
  return <div> ID: {id} </div>;
}

function FallBack(props) {
  return <div>404: URL Not Found</div>;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <BrowserRouter>
        <div>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Box p={4}><CreateGame /></Box>} />
            <Route path="/join" element={<Box p={4}><JoinGame /></Box>} />
            <Route path="/test/:id" element={<Test />} />
            <Route path="*" element={<FallBack />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
