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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';
import colors from '../styles';
import { joinRoom } from '../actions';
import API_CLIENT from '../creds';

export default function JoinGame() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    dispatch(joinRoom(values));
    navigate(`/rooms/${values.code}/questions/0`);
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

  return (
    <Box bg={colors.accent3} w="70vw">
      <Center>
        <Heading>Join an Existing Game!</Heading>
      </Center>
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
          <Input id="name"
            placeholder="be respectful, please."
            {...register('name', { required: 'This is required' })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <Center>
          <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
            Join
          </Button>
        </Center>
        <Center>
          <Button mt={4} colorScheme="teal"><NavLink to="/rooms/629580c3074e542edb5d5946/questions/0">test question</NavLink></Button>
        </Center>
      </form>
      <Center>
        <Text>No game to join? <NavLink to="/create" style={{ textDecoration: 'underline' }}>Create a new game here.</NavLink></Text>
      </Center>
    </Box>
  );
}
