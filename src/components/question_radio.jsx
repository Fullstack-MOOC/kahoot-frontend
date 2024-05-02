/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
  Stack,
  HStack,
  Image,
  Box,
  Heading,
  Text,
  useRadio,
  useRadioGroup,
  chakra,
} from '@chakra-ui/react';
// import { NavLink } from 'react-router-dom';
// import colors from '../styles';

export default function QuestionRadio(props) {
  const { image, ...radioProps } = props;
  const {
    state, getInputProps, getCheckboxProps, htmlProps, getLabelProps,
  } = useRadio(radioProps);

  const question = [
    { answer: '1', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { answer: '2', image: 'https://randomuser.me/api/portraits/men/86.jpg' },
    { answer: '3', image: 'https://randomuser.me/api/portraits/men/29.jpg' },
    { answer: '4', image: 'https://randomuser.me/api/portraits/women/95.jpg' },
  ];

  const handleChange = (value) => {
    console.log({
      title: `The value got changed to ${value}!`,
      status: 'success',
      duration: 2000,
    });

    //     roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    //   player: { type: String, required: true },
    //   response: { type: String, required: true },
    //   questionNumber: { type: Number, required: true },
    //   correct: { type: Boolean, required: true },
  };

  // eslint-disable-next-line no-unused-vars
  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: 'Kevin',
    onChange: handleChange,
  });

  //   function onSubmit(values) {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         console.log(JSON.stringify(values, null, 2));
  //         resolve();
  //       }, 3000);
  //     });
  //   }

  return (
    <Stack {...getRootProps()}>
      <Heading>{question.prompt}</Heading>
      <Text>The selected radio is: {value}</Text>
      <HStack>
        {question.map((answer) => {
          return (
            <chakra.label {...htmlProps} cursor="pointer" key={question.text}>
              <input {...getInputProps({})} hidden />
              <Box
                {...getCheckboxProps()}
                bg={state.isChecked ? 'green.200' : 'transparent'}
                w={12}
                p={1}
                rounded="full"
              >
                <Text>{question.text}</Text>
                <Image src={image} rounded="full" {...getLabelProps()} />
              </Box>
            </chakra.label>
          );
        })}
      </HStack>
    </Stack>
  );
}
