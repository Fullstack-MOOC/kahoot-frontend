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
      name: 'kahoot-storage',
    },
  ),
);

if (window.Cypress) {
  window.Storage = useBoundStore;
}

export default useBoundStore;
