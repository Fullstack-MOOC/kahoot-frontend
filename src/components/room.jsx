/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
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
import useBoundStore from '../store';

export default function Room() {
  const { roomId } = useParams();
  const [roomKey, setRoomKey] = useState('');

  const { data: room, isLoading: isRoomLoading } = getRoom(roomId);
  const players = room?.players;
  const currQuestionNum = room?.currentQuestionNumber;
  const status = room?.status;

  const { mutate: mutateChangeRoomStatus } = changeRoomStatus();
  const { mutate: mutateSubmitAnswer } = submitAnswer();

  const name = useBoundStore((state) => state.name);

  // TODO: Add Toast banners

  return (
    <Flex direction="column" align="center" height="100vh" w="100vw">
      <Heading justify="center">Admin Page</Heading>
      <Box>
        <Text>You&apos;ve successfully created a room with ID <strong>{roomId}</strong>.</Text>
        <Text>Share it with your friends! <a href={`/join?room=${roomId}`}>/join?room={roomId}</a></Text>
      </Box>
      <Input placeholder="Please enter the game's roomKey" onChange={(e) => setRoomKey(e.target.value)} w="50%" />
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
              mutateChangeRoomStatus({ code: roomId, roomKey, status: 'OPEN' });
            }}
          >
            Open Room
          </Button>
          <Button
            bgColor="blue"
            type="button"
            onClick={() => {
              mutateChangeRoomStatus({ code: roomId, roomKey, status: 'IN_PROGRESS' });
            }}
          >
            Start Game!
          </Button>
          <Button
            bgColor="black"
            type="button"
            onClick={() => {
              mutateSubmitAnswer({ roomId, player: name, response: roomKey });
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
