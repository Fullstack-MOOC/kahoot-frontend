import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { API_CLIENT } from '../utils/constants';
import useBoundStore from '../store';

export const GET_ROOM_KEY = 'GET_ROOM';

const setName = useBoundStore((state) => state.setName);
const setIsAdmin = useBoundStore((state) => state.setIsAdmin);

export const createRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (req) => {
      return axios
        .post(`${API_CLIENT}/rooms`, { name: req.creator, roomKey: req.roomKey, questions: req.questions })
        .then((res) => {
          setName(req.creator);
          setIsAdmin(true);
          return res.data;
        })
        .catch((error) => {
          console.error('createRoom error: ', error);
          throw error;
        });
    },
    onSuccess: (payload) => {
      queryClient.invalidateQueries({ queryKey: GET_ROOM_KEY });
      // navigate(`/rooms/${vals.payload.id}`); TODO
    },
  });
};

export const getRoom = (roomId) => {
  return useQuery({
    queryKey: [GET_ROOM_KEY, roomId],
    queryFn: async () => {
      return axios
        .get(`${API_CLIENT}/rooms/${roomId}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error('getRoom error: ', error);
          throw error;
        });
    },
  });
};

export const joinRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (req) => {
      const { code, name } = req;

      return axios
        .post(`${API_CLIENT}/rooms/${code}`, { name })
        .then((res) => {
          setName(name);
          setIsAdmin(false);
          return res.data;
        })
        .catch((error) => {
          console.error('joinRoom error: ', error);
          throw error;
        });
    },
    onSuccess: (payload) => {
      queryClient.invalidateQueries({ queryKey: GET_ROOM_KEY });
      // navigate(`/rooms/${values.code}/questions/0`); TODO
    },
  });
};

export const changeRoomStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req) => {
      const { code, roomKey, status } = req;

      return axios
        .patch(`${API_CLIENT}/rooms/${code}`, { roomKey, status })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error('changeRoomStatus error: ', error);
          throw error;
        });
    },
    onSuccess: (payload) => {
      queryClient.invalidateQueries({ queryKey: GET_ROOM_KEY });
    },
  });
};

export const submitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req) => {
      const { roomId, player, response } = req;

      return axios
        .post(`${API_CLIENT}/rooms/${roomId}/submissions`, { player, response })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.error('submitAnswer error: ', error);
          throw error;
        });
    },
    onSuccess: (payload) => {
      queryClient.invalidateQueries({ queryKey: GET_ROOM_KEY });
      // navigate(`${urlSplit[0]}/questions/${parseInt(urlSplit[1], 10) + 1}`);
    },
  });
};
