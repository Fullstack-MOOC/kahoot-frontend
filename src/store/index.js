import { create } from 'zustand';
import submissionSlice from './slices/submissionSlice';

const useBoundStore = create((...a) => ({
  ...submissionSlice(...a),
}));

export default useBoundStore;
