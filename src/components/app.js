import * as React from 'react';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import {
  extendTheme, ChakraProvider, CSSReset, Box,
} from '@chakra-ui/react';
import Home from './home';
import CreateGame from './create_game';
import JoinGame from './join_game';
import colors from '../styles';
import Question from './question';

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

// function Test(props) {
//   const { id } = useParams();
//   return <div> ID: {id} </div>;
// }

function FallBack(props) {
  return <div>404: URL Not Found</div>;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Box p={4}><CreateGame /></Box>} />
          <Route path="/join" element={<Box p={4}><JoinGame /></Box>} />
          {/* <Route path="/rooms/:id" element={<Test />} /> */}
          <Route path="/rooms/:roomID/questions/:questionNumber" element={<Question />} />
          <Route path="*" element={<FallBack />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
