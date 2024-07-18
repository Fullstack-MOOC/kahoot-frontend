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
import { getRoom, changeRoomStatus } from '../api/actions';
import { RoomStates } from '../utils/constants';
import Question from './question';
import useBoundStore from '../store';

export default function Room() {
  const { roomId } = useParams();
  const [roomKey, setRoomKey] = useState('');

  const { data: room, isLoading: isRoomLoading } = getRoom(roomId);
  const players = room?.players;

  const { mutate: mutateChangeRoomStatus } = changeRoomStatus();

  const name = useBoundStore((state) => state.name);

  if (isRoomLoading) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }
  if (!room) {
    return (
      <Box>
        <Text>Room does not exist</Text>
      </Box>
    );
  }
  if (players.includes(name) && room.status === RoomStates.IN_PROGRESS) {
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
  if (players.includes(name) && room.status === RoomStates.GAME_OVER) {
    return (
      <Flex direction="column" align="center">
        <Box>
          <Heading justify="center">Game has ended</Heading>
        </Box>
        <Box>
          <Text>Your rank: {room.yourRank}</Text>
          <Text marginTop={5}>Top3:</Text>
          <List>
            {room.top3 && room.top3.map((player, index) => {
              return <ListItem key={`${player}`}>{index + 1} : {player}</ListItem>;
            })}
          </List>
        </Box>
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
        <Heading justify="center" aria-label="room-title">
          Waiting Room
        </Heading>
      </Box>
      <Box>
        <Text>Room ID:&nbsp;
          <strong
            aria-label="room-id"
          >
            {roomId}
          </strong>
        </Text>
        <Text>Your Name:&nbsp;
          <strong
            aria-label="room-your-name"
          >
            {name}
          </strong>
        </Text>
        <Text>Share it with your friends! <a href={`/join?room=${roomId}`} color="blue">/join?room={roomId}</a></Text>
      </Box>
      <Flex direction="row" justifyContent="space-around" w="100%">
        <Flex border="1px" borderColor="white" direction="column" alignItems="center">
          <Heading marginBottom={5}>Players</Heading>
          <List>
            {players && players.map((player, index) => {
              return <ListItem key={`${player}`} aria-label={`player-entry-${player}`}>{player}</ListItem>;
            })}
          </List>

        </Flex>
        {
          room.isAdmin && (
            <Flex border="1px" borderColor="white" direction="column" justifyContent="space-evenly" alignItems="center">
              <Heading>Admin Controls</Heading>
              <Input
                placeholder="Please enter the game's roomKey to access Admin Controls"
                onChange={(e) => setRoomKey(e.target.value)}
                w="50%"
                marginTop={5}
                aria-label="room-input-admin-key"
              />
              {
                room.status === RoomStates.CLOSED && (
                  <Button
                    bgColor="red"
                    type="button"
                    onClick={() => {
                      mutateChangeRoomStatus({ code: roomId, roomKey, status: RoomStates.OPEN });
                    }}
                    marginTop={5}
                    aria-label="room-open-room-button"
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
                    marginTop={5}
                  >
                    Start Game!
                  </Button>
                )
              }
            </Flex>
          )
        }
      </Flex>
    </Flex>
  );
}
