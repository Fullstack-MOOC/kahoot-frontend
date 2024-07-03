const userSlice = (set) => ({
  name: '',
  setUserName: (name) => set(() => ({ name })),
});

export default userSlice;
