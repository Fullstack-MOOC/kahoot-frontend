import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import submissionSlice from './slices/submissionSlice';
import userSlice from './slices/userSlice';

const useBoundStore = create(
  persist(
    (...a) => ({
      ...submissionSlice(...a),
      ...userSlice(...a),
    }),
    {
      name: 'kahoot-storage', // name of the item in the storage (must be unique)
    },
  ),
);

export default useBoundStore;
