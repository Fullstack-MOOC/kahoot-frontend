import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { API_CLIENT } from '../utils/constants';
import useBoundStore from '../store';

export const GET_ROOM_KEY = 'GET_ROOM';

export const createRoom = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const setUserName = useBoundStore((state) => state.setUserName);
  const setLastSubmission = useBoundStore((state) => state.setLastSubmission);

  return useMutation({
    mutationFn: async (req) => {
      return axios
        .post(`${API_CLIENT}/rooms`, { creator: req.creator, roomKey: req.roomKey, questions: req.questions })
        .then((res) => {
          setUserName(req.creator);
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
      setLastSubmission(null);
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
};

export const getRoom = (roomId) => {
  const name = useBoundStore((state) => state.name);

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
  const setUserName = useBoundStore((state) => state.setUserName);

  return useMutation({
    mutationFn: async (req) => {
      const { code, name } = req;

      return axios
        .post(`${API_CLIENT}/rooms/${code}`, { name })
        .then((res) => {
          setUserName(name);
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
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
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
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries({ queryKey: [GET_ROOM_KEY, payload.id] });
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
};

export const submitAnswer = () => {
  const queryClient = useQueryClient();

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
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
};

export const forceSubmitAnswer = () => {
  const queryClient = useQueryClient();

  const setLastSubmission = useBoundStore((state) => state.setLastSubmission);

  return useMutation({
    mutationFn: async (req) => {
      const { roomId, roomKey } = req;

      return axios
        .post(`${API_CLIENT}/rooms/${roomId}/submissions`, { roomKey, force: true })
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
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
};
