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

export default function CreateGame() {
  const ref = useRef();

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
    <Box bg={colors.accent3}><Heading>Create a New Room!</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">First name</FormLabel>
          <Input
            id="name"
            placeholder="name"
            {...register('name', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email}>
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input id="email" type="email" />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
          <FormLabel htmlFor="questions">Questions &amp; Responses</FormLabel>
        </FormControl>
        <FormControl isInvalid={errors.questions}>
          <Textarea
            minH="unset"
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
      <Text>Game already created? <NavLink to="/join">Join an existing game here.</NavLink></Text>
    </Box>
  );
}
