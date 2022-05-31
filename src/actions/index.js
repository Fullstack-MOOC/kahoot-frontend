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

export const getRooms = () => (dispatch) => {
  try {
    axios.get(`${API_CLIENT}/rooms`)
      .then((res) => {
        const response = res.data;
        dispatch({
          type: ActionTypes.GET_ROOMS,
          payload: response,
        });
      });
  } catch (error) {
    dispatch(error(`Request Failed: ${error.response.data}`));
  }
};

export const getRoom = (roomID) => (dispatch) => {
  try {
    axios.get(`${API_CLIENT}/rooms/${roomID}`)
      .then((res) => {
        const response = res.data;
        dispatch({
          type: ActionTypes.GET_ROOM,
          payload: response,
        });
      });
  } catch (error) {
    dispatch(error(`Request Failed: ${error.response.data}`));
  }
};

export const getQuestion = (roomID, questionNumber) => (dispatch) => {
  try {
    axios.get(`${API_CLIENT}/rooms/${roomID}`)
      .then((res) => {
        const response = res.data;
        const question = response.questions[parseInt(questionNumber, 10)];
        dispatch({
          type: ActionTypes.GET_QUESTION,
          payload: question,
        });
      });
  } catch (error) {
    dispatch(error(`Request Failed: ${error.response.data}`));
  }
};

export const createRoom = (params) => (dispatch) => {
  try {
    const { roomKey } = params;
    axios.post(`${API_CLIENT}/rooms`, params)
      .then((res) => {
        const response = res.data;
        dispatch({
          type: ActionTypes.MAKE_ROOM,
          payload: response,
          roomKey,
        });
        // axios.get(`${API_CLIENT}/rooms`)
        //   .then((res) => {
        //     const response = res.data;
        //     dispatch({
        //       type: ActionTypes.GET_POSTS,
        //       payload: response,
        //     });
        //   });
      });
  } catch (error) {
    dispatch(error(`Create Room Failed: ${error.response.data}`));
  }
};

export const joinRoom = (params) => (dispatch) => {
  try {
    const { code, name } = params;
    axios.post(`${API_CLIENT}/rooms/${code}`, { name })
      .then((res) => {
        const response = res.data;
        console.log(response);
        dispatch({
          type: ActionTypes.JOIN_ROOM,
          payload: response,
        });
      });
  } catch (error) {
    dispatch(error(`Join Room Failed: ${error.response.data}`));
  }
};

export const submitAnswer = (roomID, params) => (dispatch) => {
  try {
    axios.post(`${API_CLIENT}/rooms/${roomID}/submissions`, params)
      .then((res) => {
        const response = res.data;
        dispatch({
          type: ActionTypes.SUBMIT_ANSWER,
          payload: response,
        });
        // axios.get(`${API_CLIENT}/rooms`)
        //   .then((res) => {
        //     const response = res.data;
        //     dispatch({
        //       type: ActionTypes.GET_POSTS,
        //       payload: response,
        //     });
        //   });
      });
  } catch (error) {
    dispatch(error(`Create Room Failed: ${error.response.data}`));
  }
};

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
