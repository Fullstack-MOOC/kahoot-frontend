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
import { RoomStates } from '../utils/constants';
import Question from './question';

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

  if (!room) {
    return (
      <Flex direction="column" align="center">
        <Text>Room does not exist</Text>
      </Flex>
    );
  }
  if (!players.includes(name) && room.status === RoomStates.IN_PROGRESS) {
    return (
      <Question />
    );
  }
  if (!players.includes(name) && room.status === RoomStates.IN_PROGRESS) {
    return (
      <Flex direction="column" align="center">
        <Text>Game has already started</Text>
      </Flex>
    );
  }
  if (!players.includes(name) && room.status === RoomStates.GAME_OVER) {
    return (
      <Flex direction="column" align="center">
        <Text>Game has already ended</Text>
      </Flex>
    );
  }
  return (
    <Flex direction="column" align="center">
      <Box>
        <Heading justify="center">
          Waiting Room
        </Heading>
      </Box>
      {
        JSON.stringify(room)
      }
      <Box>
        <Text>Room ID: <strong>{roomId}</strong>.</Text>
        <Text>Share it with your friends! <a href={`/join?room=${roomId}`}>/join?room={roomId}</a></Text>
      </Box>
      <Input placeholder="Please enter the game's roomKey to access Admin Controls" onChange={(e) => setRoomKey(e.target.value)} w="50%" />
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
          <Heading>Admin Controls</Heading>
          {
            room.status === RoomStates.CLOSED && (
              <Button
                bgColor="red"
                type="button"
                onClick={() => {
                  mutateChangeRoomStatus({ code: roomId, roomKey, status: RoomStates.OPEN });
                }}
              >
                Open Room
              </Button>
            )
          }
          {
            room.status === RoomStates.OPEN && (
              <Button
                bgColor="blue"
                type="button"
                onClick={() => {
                  mutateChangeRoomStatus({ code: roomId, roomKey, status: 'IN_PROGRESS' });
                }}
              >
                Start Game!
              </Button>
            )
          }
          {
            room.status === RoomStates.IN_PROGRESS && (
              <Button
                bgColor="black"
                type="button"
                onClick={() => {
                  mutateSubmitAnswer({ roomId, player: name, response: roomKey });
                }}
              >
                Force Answers!
              </Button>
            )
          }
        </Flex>
      </Flex>
    </Flex>
  );
}
