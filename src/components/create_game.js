/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Textarea,
  Center,
  Heading,
  Box,
  Text,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import ResizeTextarea from 'react-textarea-autosize';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import colors from '../styles';
import { createRoom } from '../actions';

export default function CreateGame() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    dispatch(createRoom(values, navigate));
  }

  function isJsonString(str) {
    let error;
    try {
      JSON.parse(str);
    } catch (e) {
      return 'Must be valid JSON string.';
    }
    return error;
  }

  return (
    <Box bg={colors.accent3} w="70vw">
      <Center>
        <Heading>Create a New Room!</Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.creator}>
          <FormLabel htmlFor="creator">First name</FormLabel>
          <Input
            id="creator"
            placeholder="name"
            {...register('creator', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <FormErrorMessage>
            {errors.creator && errors.creator.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.roomKey}>
          <FormLabel htmlFor="roomKey">Room Key</FormLabel>
          <Input id="roomKey"
            placeholder="room key"
            {...register('roomKey', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <FormErrorMessage>
            {errors.roomKey && errors.roomKey.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.questions}>
          <FormLabel htmlFor="questions">Questions &amp; Responses</FormLabel>
          <Textarea
            minH="100px"
            overflow="hidden"
            w="100%"
            resize="none"
            ref={ref}
            minRows={1}
            as={ResizeTextarea}
            placeholder="Please enter your questions &amp; responses in JSON format"
          // eslint-disable-next-line react/jsx-no-bind
            validate={isJsonString}
            {...register('questions', {
              required: 'Questions are required',
            })}
          />
          <FormErrorMessage>
            {errors.questions && errors.questions.message}
          </FormErrorMessage>
        </FormControl>
        <Center>
          <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
            Submit
          </Button>
        </Center>
      </form>
      <Center>
        <Text>Game already created? <NavLink to="/join" style={{ textDecoration: 'underline' }}>Join an existing game here.</NavLink></Text>
      </Center>
    </Box>
  );
}
