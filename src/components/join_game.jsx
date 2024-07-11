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
import { NavLink, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import colors from '../styles';
import { API_CLIENT } from '../utils/constants';
import { joinRoom } from '../api/actions';

export default function JoinGame() {
  const { mutate: mutateJoinRoom } = joinRoom();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [searchParams] = useSearchParams();

  const roomId = searchParams.get('room');

  function onSubmit(values) {
    console.log(values);
    if (roomId) {
      // eslint-disable-next-line no-param-reassign
      values.code = roomId;
    }

    mutateJoinRoom(values);
  }

  function isValidCode(code) {
    let error;
    try {
      axios.get(`${API_CLIENT}/rooms/${code}`)
        .then((res) => {
          const response = res.data;
          console.log('the code is valid!');
          console.log(response);
        });
    } catch (e) {
      return 'Invalid game code. Check again.';
    }
    return error;
  }

  const renderDependingOnParam = () => {
    if (roomId) {
      return (
        <Input
          id="code"
          placeholder="game code"
          isDisabled
          value={roomId}
          aria-label="join-game-code-input-disabled"
        />
      );
    }
    return (
      <Input
        id="code"
        placeholder="game code"
        // eslint-disable-next-line react/jsx-no-bind
        validate={isValidCode}
        {...register('code', {
          required: 'This is required',
          minLength: { value: 6, message: 'Minimum length should be 6' },
        })}
        aria-label="join-game-code-input"
      />
    );
  };

  return (
    <Box bg={colors.accent3} marginTop={10}>
      <Center>
        <Heading>Join an Existing Game!</Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.code}>
          <FormLabel htmlFor="code">Game Code</FormLabel>
          {renderDependingOnParam()}
          <FormErrorMessage>
            {errors.code && errors.code.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">name</FormLabel>
          <Input id="name"
            placeholder="be respectful, please."
            {...register('name', { required: 'This is required' })}
            aria-label="join-game-name-input"
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <Center>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            aria-label="submit-button"
          >
            Join
          </Button>
        </Center>
      </form>
      <Center>
        <Text>No game to join? <NavLink to="/create" style={{ textDecoration: 'underline' }}>Create a new game here.</NavLink></Text>
      </Center>
    </Box>
  );
}
