import * as React from 'react';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import {
  extendTheme, ChakraProvider, CSSReset, Box, Container,
} from '@chakra-ui/react';
import Home from './home';
import CreateGame from './create_game';
import JoinGame from './join_game';
import colors from '../styles';
import Question from './question';
import Room from './room';

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
      textDecoration: 'underline',
      _hover: {
        textDecoration: 'underline',
        color: colors.accent4,
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

function FallBack(props) {
  return <div>404: URL Not Found</div>;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Container minHeight="100vh" minWidth="100vh">
        <CSSReset />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateGame />} />
            <Route path="/join" element={<JoinGame />} />
            <Route path="/rooms/:roomId" element={<Room />} />
            <Route path="*" element={<FallBack />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </ChakraProvider>
  );
}

export default App;
