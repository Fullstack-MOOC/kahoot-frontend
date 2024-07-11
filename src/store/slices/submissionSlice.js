const submissionSlice = (set) => ({
  lastSubmission: {},
  setLastSubmission: (submission) => set(() => ({ lastSubmission: submission })),
});

export default submissionSlice;
