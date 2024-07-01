import { create } from 'zustand';
import userSlice from './slices/userSlice';

const useBoundStore = create((...a) => ({
  ...userSlice(...a),
}));

export default useBoundStore;
