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
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import colors from '../styles';
import { getQuestion, submitAnswer } from '../actions';

export default function Question() {
  const location = useLocation();
  const { roomID, questionNumber } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (roomID) {
      console.log('getting room', roomID);
      dispatch(getQuestion(roomID, questionNumber));
    }
  }, []);

  const question = useSelector((reduxState) => reduxState.reducer.question);
  const player = useSelector((reduxState) => reduxState.reducer.player);

  function onSubmit(values) {
    console.log(values);
    console.log(values.answer);
    dispatch(submitAnswer({ roomID, player, response: values.answer })).unwrap().then(() => {
      console.log(location.pathname);
      const urlSplit = location.pathname.split('/questions/');
      console.log(urlSplit);
      navigate(`${urlSplit[0]}/questions/${parseInt(urlSplit[1], 10) + 1}`);
    }).catch((error) => console.log(error));
  }
  if (question != null) {
    return (
      <Box bg={colors.accent3}><Heading>Question #{parseInt(questionNumber, 10) + 1}: {question}</Heading>
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
            <Button bgColor="orange"
              onClick={() => {
                dispatch(getQuestion());
              }}
            >Refresh
            </Button>
          </Center>
        </form>
      </Box>
    );
  } else {
    return (
      <Box>
        <Text>Loading question....</Text>
        <Button bgColor="orange"
          onClick={() => {
            dispatch(getQuestion());
          }}
        >Refresh
        </Button>
      </Box>
    );
  }
}
