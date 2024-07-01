/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
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
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import colors from '../styles';
import { getRoom, submitAnswer } from '../api/actions';
import useBoundStore from '../store';

export default function Question() {
  const location = useLocation();
  const { roomId, questionNumber } = useParams();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: room, isLoading: isRoomLoading } = getRoom(roomId);
  const { mutate: mutateSubmitAnswer } = submitAnswer();

  const name = useBoundStore((state) => state.name);

  function onSubmit(values) {
    mutateSubmitAnswer({ roomId, name, response: values.answer });
  }
  if (!isRoomLoading && !room.currentQuestion) {
    return (
      <Box bg={colors.accent3}><Heading>Question #{parseInt(questionNumber, 10) + 1}: {room.currentQuestion}</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.answer}>
            <FormLabel htmlFor="code">Answer</FormLabel>
            <Input
              id="answer"
              placeholder="your answer"
              {...register('answer', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>
              {errors.answer && errors.answer.message}
            </FormErrorMessage>
          </FormControl>
          <Center>
            <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
              Answer
            </Button>
          </Center>
        </form>
      </Box>
    );
  } else {
    return (
      <Box>
        <Text>Loading question....</Text>
      </Box>
    );
  }
}
