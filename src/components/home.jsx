import {
  Box, Heading, Text, ButtonGroup, Button, Center,
} from '@chakra-ui/react';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  return (

    <Box>
      <Center>
        <Heading>Welcome to Coursera MOOC Kahoot!</Heading>
      </Center>
      <Center>
        <Text>Create your own quiz &amp; share it with your friends :)</Text>
      </Center>
      <Center>
        <ButtonGroup gap="2">
          <Button colorScheme="teal"><NavLink to="/create">New Game</NavLink></Button>
          <Button colorScheme="teal"><NavLink to="/join">Join Game</NavLink></Button>
        </ButtonGroup>
      </Center>
    </Box>

  );
}
