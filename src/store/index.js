import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import userSlice from './slices/userSlice';

const useBoundStore = create(
  persist(
    (...a) => ({
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
