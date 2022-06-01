import * as React from 'react';
import { useParams } from 'react-router';
import { Box, Text } from '@chakra-ui/react';
import { openRoom } from '../actions';

export default function Room() {
  const { roomID } = useParams();
  return (
    <Box>
      <Text>You&apos;ve successfully created a room with ID <strong>{roomID}</strong>.</Text>
      <Text>Share it with your friends! <a href={`/join?room=${roomID}`}>/join?room={roomID}</a></Text>
      <button type="button" onClick={() => { openRoom(roomID, { roomkey: 'secret', status: 'OPEN' }); }}>Open Room</button>
    </Box>
  );
}
