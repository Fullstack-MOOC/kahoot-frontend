import { ActionTypes } from '../actions';

const initialState = {
  room: '62954269074e542edb5d58fa',
  question: null,
  player: null,
  isAdmin: false,
  roomKey: 'secret',
  all_rooms: [],
  scoreboard: null,
};

function RootReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.MAKE_ROOM:
      console.log(action.payload);
      return {
        ...state, room: action.payload, isAdmin: true, roomKey: action.roomKey,
      };
    case ActionTypes.GET_ROOM:
      console.log(action.payload);
      return {
        ...state, room: action.payload,
      };
    case ActionTypes.JOIN_ROOM:
      console.log(action.payload);
      return {
        ...state, room: action.payload,
      };
    case ActionTypes.GET_ROOMS:
      return { ...state, all_rooms: action.payload };
    case ActionTypes.GET_QUESTION:
      return { ...state, question: action.payload };
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
