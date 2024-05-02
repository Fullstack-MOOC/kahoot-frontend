/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Flex, Heading, Text, Button, Input, Box, ButtonGroup, SimpleGrid, ListItem, List,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import {
  openRoom, startGame, getRoom, forceAnswer,
} from '../actions';

export default function Room() {
  const { roomID } = useParams();
  const [roomKey, setroomKey] = useState('');
  const [players, setPlayers] = useState([]);
  const [currQuestionNum, setCurrQuestionNum] = useState(-1);
  const [status, setStatus] = useState('CLOSED');

  const dispatch = useDispatch();

  const fetchRoom = async () => {
    const room = await getRoom(roomID);
    setStatus(room.status);
    setPlayers(room.players);
    setCurrQuestionNum(room.currentQuestionNumber + 1);
    console.log(room.currentQuestionNumber);
  };
  useEffect(() => {
    fetchRoom();
  }, []);

  return (
    <Flex direction="column" align="center" height="100vh" w="100vw">
      <Heading justify="center">Admin Page</Heading>
      <Box>
        <Text>You&apos;ve successfully created a room with ID <strong>{roomID}</strong>.</Text>
        <Text>Share it with your friends! <a href={`/join?room=${roomID}`}>/join?room={roomID}</a></Text>
      </Box>
      <Input placeholder="Please enter the game's roomKey" onChange={(e) => setroomKey(e.target.value)} w="50%" />
      <Button bgColor="Orange" onClick={async () => { await fetchRoom(); }}>Refresh</Button>
      <Flex direction="row" justifyContent="space-around" w="100%">
        <Flex border="1px" borderColor="white" direction="column" alignItems="center">
          <Heading>Players</Heading>
          <List>
            {players ? players.map((player, index) => {
              return <ListItem key={`${player}`}>{player}</ListItem>;
            }) : null}
          </List>

        </Flex>
        <Flex border="1px" borderColor="white" direction="column" justifyContent="space-evenly" alignItems="center">
          <Heading>Controls</Heading>
          <Button bgColor="red" type="button" onClick={() => { dispatch(openRoom({ roomID, roomKey })).then(() => fetchRoom()); }}>Open Room</Button>
          <Button bgColor="blue" type="button" onClick={() => { dispatch(startGame(roomID, { roomkey: roomKey, status: 'IN_PROGRESS' })).then(() => fetchRoom()); }}>Start Game!</Button>
          <Button bgColor="black" type="button" onClick={() => { forceAnswer(roomID, roomKey); }}> Force Answers!</Button>
        </Flex>
        <Flex direction="column" border="1px" borderColor="white" alignItems="center">
          <Heading>Status</Heading>
          <Heading as="h4" size="lg">{status}</Heading>
          <Heading>Curr Q</Heading>
          <Heading as="h4" size="lg" color="green">{currQuestionNum}</Heading>
        </Flex>
      </Flex>
    </Flex>
  );
}
