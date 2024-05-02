import * as React from 'react';
import { useParams } from 'react-router';
import { Box, Text } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getScoreboard } from '../actions';

export default function Scoreboard() {
  const { roomID } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (roomID) {
      console.log('getting scoreboard', roomID);
      dispatch(getScoreboard(roomID));
    //   dispatch(getRoom(roomID));
    }
  }, []);

  const scoreboard = useSelector((reduxState) => reduxState.scoreboard);

  return (
    <Box>
      <Text>Scoreboard for <strong>{roomID}</strong>.</Text>
      <Text>{JSON.stringify(scoreboard)}</Text>
    </Box>
  );
}
