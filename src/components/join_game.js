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
import { NavLink } from 'react-router-dom';
import colors from '../styles';

export default function JoinGame() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        resolve();
      }, 3000);
    });
  }

  function isValidCode(str) {
    let error;
    try {
      // get room
      console.log('hey');
    } catch (e) {
      return 'Invalid game code. Check again.';
    }
    return error;
  }

  return (
    <Box bg={colors.accent3}><Heading>Join an Existing Game!</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.code}>
          <FormLabel htmlFor="code">Game Code</FormLabel>
          <Input
            id="code"
            placeholder="game code"
          // eslint-disable-next-line react/jsx-no-bind
            validate={isValidCode}
            {...register('code', {
              required: 'This is required',
              minLength: { value: 6, message: 'Minimum length should be 6' },
            })}
          />
          <FormErrorMessage>
            {errors.code && errors.code.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">name</FormLabel>
          <Input id="name" placeholder="be respectful, please." />
          <FormErrorMessage>
            {errors.name && errors.naem.message}
          </FormErrorMessage>
        </FormControl>
        <Center>
          <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
            Join
          </Button>
        </Center>

      </form>
      <Text>No game to join? <NavLink to="/create">Create a new game here.</NavLink></Text>
    </Box>
  );
}
