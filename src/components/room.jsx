/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Box,
  ListItem,
  List,
} from '@chakra-ui/react';
import { getRoom, changeRoomStatus, submitAnswer } from '../api/actions';

export default function Room() {
  const { roomId } = useParams();
  const [roomKey, setroomKey] = useState('');

  const { data: room, isLoading: isRoomLoading } = getRoom(roomId);
  const { players, currentQuestionNumber: currQuestionNum, status } = room;

  const { mutate: mutateChangeRoomStatus } = changeRoomStatus();
  const { mutate: mutateSubmitAnswer } = submitAnswer();

  const name = useBoundStore((state) => state.name);

  return (
    <Flex direction="column" align="center" height="100vh" w="100vw">
      <Heading justify="center">Admin Page</Heading>
      <Box>
        <Text>You&apos;ve successfully created a room with ID <strong>{roomId}</strong>.</Text>
        <Text>Share it with your friends! <a href={`/join?room=${roomId}`}>/join?room={roomId}</a></Text>
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
          <Button
            bgColor="red"
            type="button"
            onClick={() => {
              mutateChangeRoomStatus(roomId, roomKey, 'OPEN');
            }}
          >
            Open Room
          </Button>
          <Button
            bgColor="blue"
            type="button"
            onClick={() => {
              mutateChangeRoomStatus(roomId, roomKey, 'IN_PROGRESS');
            }}
          >
            Start Game!
          </Button>
          <Button
            bgColor="black"
            type="button"
            onClick={() => {
              mutateSubmitAnswer(roomId, name, roomKey);
            }}
          >
            Force Answers!
          </Button>
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
