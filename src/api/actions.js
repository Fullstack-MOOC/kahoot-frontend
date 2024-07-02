import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { API_CLIENT } from '../utils/constants';
import { getName, setName } from '../utils/localStorage';
import useBoundStore from '../store';

export const GET_ROOM_KEY = 'GET_ROOM';

export const createRoom = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (req) => {
      return axios
        .post(`${API_CLIENT}/rooms`, { creator: req.creator, roomKey: req.roomKey, questions: req.questions })
        .then((res) => {
          setName(req.creator);
          return res.data;
        })
        .catch((error) => {
          console.error('createRoom error: ', error);
          throw error;
        });
    },
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ROOM_KEY, payload.id] });
      navigate(`/rooms/${payload.id}`);
    },
  });
};

export const getRoom = (roomId) => {
  const name = getName();

  return useQuery({
    queryKey: [GET_ROOM_KEY, roomId],
    queryFn: async () => {
      return axios
        .get(`${API_CLIENT}/rooms/${roomId}?player=${name}`)
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
          return res.data;
        })
        .catch((error) => {
          console.error('joinRoom error: ', error);
          throw error;
        });
    },
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ROOM_KEY, payload.roomId] });
      navigate(`/rooms/${payload.roomId}`);
    },
  });
};

export const changeRoomStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req) => {
      const { code, roomKey, status } = req;
      console.log(code, roomKey, status);

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
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ROOM_KEY, payload.id] });
    },
  });
};

export const submitAnswer = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const setLastSubmission = useBoundStore((state) => state.setLastSubmission);

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
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ROOM_KEY, payload.roomId] });
      setLastSubmission(payload);
    },
  });
};

export const getLastSubmsision = () => {
  return '';
};
