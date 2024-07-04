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
import colors from '../styles';
import { createRoom } from '../api/actions';

export default function CreateGame() {
  const ref = useRef();

  const { mutate: mutateCreateRoom } = createRoom();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    // eslint-disable-next-line no-param-reassign
    values.questions = values.questions.replace(/\n|\r/g, '');
    console.log('Called submit', values.questions);
    // eslint-disable-next-line no-param-reassign
    values.questions = JSON.parse(values.questions);

    mutateCreateRoom(values);
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
    <Box bg={colors.accent3} marginTop={10}>
      <Center>
        <Heading>Create a New Room!</Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.creator}>
          <FormLabel htmlFor="creator">Name</FormLabel>
          <Input
            id="creator"
            placeholder="name"
            {...register('creator', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <FormErrorMessage
            data-cy="error-message-name"
          >
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
          <FormErrorMessage
            data-cy="error-message-room-key"
          >
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
          <FormErrorMessage
            data-cy="error-message-question-responses"
          >
            {errors.questions && errors.questions.message}
          </FormErrorMessage>
        </FormControl>
        <Center>
          <Button 
            mt={4} 
            colorScheme="teal" 
            isLoading={isSubmitting} 
            type="submit"
            data-cy="submit-button"
          >
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
