/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Center,
  Box,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import colors from '../styles';
import {
  getRoom,
  submitAnswer,
  forceSubmitAnswer,
  GET_ROOM_KEY,
} from '../api/actions';
import { RoomStates } from '../utils/constants';
import useBoundStore from '../store';

export default function Question() {
  const location = useLocation();
  const { roomId, questionNumber } = useParams();
  const navigate = useNavigate();
  const [roomKey, setRoomKey] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: room, isLoading: isRoomLoading } = getRoom(roomId);
  const { mutate: mutateSubmitAnswer } = submitAnswer();
  const { mutate: mutateForceSubmitAnswer } = forceSubmitAnswer();

  const name = useBoundStore((state) => state.name);
  const lastSubmission = (room?.submissionHistory && room?.submissionHistory?.length > 0) ? room.submissionHistory[room.submissionHistory.length - 1] : null;

  const queryClient = useQueryClient();

  function onSubmit(values) {
    mutateSubmitAnswer({ roomId, player: name, response: values.answer });
  }
  if (isRoomLoading || !room.currentQuestion) {
    return (
      <Box>
        <Text>Loading question....</Text>
      </Box>
    );
  } else if (lastSubmission && lastSubmission.questionNumber === room.currentQuestionNumber) {
    return (
      <Box>
        <Box bg={colors.accent3}>
          <Center>
            <Heading aria-label="question-result">{ lastSubmission.correct ? 'Correct' : 'Incorrect' }</Heading>
          </Center>
          <Center>
            <Text>Your rank: {room.yourRank}</Text>
          </Center>
          <Center>
            <Button
              bgColor="black"
              type="button"
              onClick={async () => {
                await queryClient.invalidateQueries({ queryKey: [GET_ROOM_KEY, roomId] });
              }}
              marginTop={5}
            >
              Force Reload
            </Button>
          </Center>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box>
        <Box bg={colors.accent3}>
          <Heading aria-label="question-heading">Question #{room.currentQuestionNumber + 1}: {room.currentQuestion}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.answer}>
              <FormLabel htmlFor="code">Answer</FormLabel>
              <Input
                id="answer"
                placeholder="your answer"
                {...register('answer', {
                  required: 'This is required',
                })}
                aria-label="question-answer-input"
              />
              <FormErrorMessage>
                {errors.answer && errors.answer.message}
              </FormErrorMessage>
            </FormControl>
            <Center>
              <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit" aria-label="submit-button">
                Answer
              </Button>
            </Center>
          </form>
        </Box>
        {
          room.isAdmin && (
            <Flex border="1px" borderColor="white" direction="column" justifyContent="space-evenly" alignItems="center" marginTop={10}>
              <Heading>Admin Controls</Heading>
              <Input
                placeholder="Please enter the game's roomKey to access Admin Controls"
                onChange={(e) => setRoomKey(e.target.value)}
                w="50%"
                marginTop={5}
                aria-label="force-answers-input"
              />
              {
                room.status === RoomStates.IN_PROGRESS && (
                  <Button
                    bgColor="black"
                    type="button"
                    onClick={() => {
                      mutateForceSubmitAnswer({ roomId, roomKey });
                    }}
                    marginTop={5}
                    aria-label="force-answers-button"
                  >
                    Force Answers!
                  </Button>
                )
              }
            </Flex>
          )
        }
      </Box>
    );
  }
}
