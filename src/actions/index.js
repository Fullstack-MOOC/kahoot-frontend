/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import API_CLIENT from '../creds';

// keys for action types
export const ActionTypes = {
  MAKE_ROOM: 'm',
  GET_ROOMS: 'g',
  GET_ROOM: 'gr',
  JOIN_ROOM: 'jr',
  GET_QUESTION: 'gq',
  SUBMIT_ANSWER: 's',
  DELETE_ROOM: 'd',
  GET_SCOREBOARD: 'sb',
};

const roomStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  GAME_OVER: 'GAME_OVER',

};

/**
 * Fetch all information about a specific room
 *
 * @param {*} roomID - ID of the room that you want to fetch
 * @returns the specified room object as defined in the database schema
 */
export const getRoom = async (roomID) => {
  try {
    const res = await axios.get(`${API_CLIENT}/rooms/${roomID}`);
    const room = res.data;
    console.log(room);
    return room;
  } catch (error) {
    throw new Error('Could not get Status');
  }
};

export const forceAnswer = async (roomID, roomKey) => {
  const res = await axios.post(`${API_CLIENT}/rooms/${roomID}/submissions`, { roomKey, force: true });
  return res.data;
};

export const getQuestion = createAsyncThunk(
  'kahoot/getQuestion',
  async (roomID) => {
    try {
      const response = await axios.get(`${API_CLIENT}/rooms/${roomID}`);
      const roomState = response.data;
      if (roomState.status === roomStatus.GAME_OVER) {
        throw new Error('Game is over!');
      }
      if (roomState.status !== roomStatus.IN_PROGRESS) {
        throw new Error('Game is not in progress');
      }
      return roomState.currentQuestion;
    } catch (error) {
      return error(`Request Failed: ${error.response.data}`);
    }
  },
);

export const createRoom = createAsyncThunk(
  'kahoot/createRoom',
  (roomInfo, { rejectWithValue }) => {
    try {
      console.log(roomInfo);
      return axios.post(`${API_CLIENT}/rooms`, { name: roomInfo.creator, roomKey: roomInfo.roomKey, questions: roomInfo.questions })
        .then((res) => {
          const response = res.data;
          console.log(response);
          return response;
        }).catch((error) => { console.log(error.response.data); });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const startGame = (roomId, params) => (dispatch) => {
  try {
    console.log(params);
    axios.patch(`${API_CLIENT}/rooms/${roomId}`, { roomKey: params.roomkey, status: params.status })
      .catch((error) => console.log(error.response.data));
  } catch (error) {
    dispatch((error(`Could not start game: ${error.response.data}`)));
  }
};

export const openRoom = createAsyncThunk(
  'kahoot/openRoom',
  async (roomInfo, { rejectWithValue }) => {
    const { roomID, roomKey } = roomInfo;
    try {
      const res = await axios.patch(`${API_CLIENT}/rooms/${roomID}`, { roomKey, status: 'OPEN' });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const joinRoom = createAsyncThunk(
  'kahoot/joinRoom',
  async (params) => {
    const { code, name } = params;
    const res = await axios.post(`${API_CLIENT}/rooms/${code}`, { name });
    const response = res.data;
    console.log(response);
    return response;
  },
);

export const submitAnswer = createAsyncThunk(
  'kahoot/submitAnswer',
  async (submitParams, { rejectWithValue }) => {
    try {
      const { roomID, player, response } = submitParams;
      const res = await axios.post(`${API_CLIENT}/rooms/${roomID}/submissions`, { player, response });
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  },
);

export const getScoreboard = (roomID) => (dispatch) => {
  try {
    axios.get(`${API_CLIENT}/rooms/${roomID}/scoreboard`)
      .then((res) => {
        const response = res.data;
        dispatch({
          type: ActionTypes.GET_SCOREBOARD,
          payload: response,
        });
      });
  } catch (error) {
    dispatch(error(`Scoreboard Request Failed: ${error.response.data}`));
  }
};
