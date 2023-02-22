/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import {
  ActionTypes, createRoom, getQuestion, joinRoom, openRoom, submitAnswer,
} from '../actions';

const initialState = {
  room: '62954269074e542edb5d58fa',
  question: null,
  player: '',
  isAdmin: false,
  roomKey: 'secret',
  all_rooms: [],
  scoreboard: null,
};

export const kahootSlice = createSlice({
  name: 'kahoot',
  initialState,
  reducers: {
    [ActionTypes.MAKE_ROOM]: (state, action) => {
      const { room, roomKey } = action.payload;
      state.room = room;
      state.isAdmin = true;
      state.roomKey = roomKey;
    },
    [ActionTypes.GET_ROOM]: (state, action) => {
      const { room } = action.payload;
      state.room = room;
    },
    [ActionTypes.GET_QUESTION]: (state, action) => {
      console.log(action, 'in the creator');
      const { question } = action.payload;
      state.question = question;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createRoom.fulfilled, (state, action) => {
      console.log(`this is the action${action}`);
    });
    builder.addCase(openRoom.fulfilled, (state, action) => {
      console.log('Opened Room');
      return ('console');
    });
    builder.addCase(openRoom.rejected, (state, action) => {
      return ('failed');
    });
    builder.addCase(getQuestion.fulfilled, (state, action) => {
      state.question = action.payload;
    });
    builder.addCase(joinRoom.fulfilled, (state, action) => {
      state.player = action.payload.yourName;
    });
    builder.addCase(submitAnswer.fulfilled, (state, action) => {
      console.log(action);
    });
  },
});

function RootReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.MAKE_ROOM:
      console.log(action.payload);
      return {
        ...state, room: action.payload, isAdmin: true, roomKey: action.roomKey,
      };
    // case ActionTypes.GET_ROOM:
    //   console.log(action.payload);
    //   return {
    //     ...state, room: action.payload,
    //   };
    case ActionTypes.JOIN_ROOM:
      console.log(action.payload);
      return {
        ...state, room: action.payload,
      };
    case ActionTypes.GET_ROOMS:
      return { ...state, all_rooms: action.payload };
    // case ActionTypes.GET_QUESTION:
    //   return { ...state, question: action.payload };
    case ActionTypes.SUBMIT_ANSWER:
      return { ...state, question: action.payload };
    case ActionTypes.DELETE_ROOM:
      return { ...state, room: null, isAdmin: false };
    case ActionTypes.GET_SCOREBOARD:
      return { ...state, scoreboard: action.payload };
    default:
      return state;
  }
}

export default RootReducer;
