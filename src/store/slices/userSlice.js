const userSlice = (set) => ({
  name: '',
  isAdmin: false,
  setName: (name) => set(() => ({ name })),
  setIsAdmin: (bool) => set(() => ({ isAdmin: bool })),
});

export default userSlice;
