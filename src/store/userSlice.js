import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  userName: "",
  activeFriendIds: [],
  contactFriendIds: [],
  profilePic: null,
  isOnline: false,
  lastSeen: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfileData: (state, action) => {
      state.id = action.payload._id;
      state.userName = action.payload.userName;
      state.activeFriendIds = action.payload.activeFriendIds;
      state.contactFriendIds = action.payload.contactFriendIds;
      state.profilePic = action.payload.profilePic;
      state.isOnline = action.payload.isOnline;
      state.lastSeen = action.payload.lastSeen;
    },
    resetToDefault: (state) => {
      state.id = null;
      state.userName = "";
      state.activeFriendIds = [];
      state.contactFriendIds = [];
      state.profilePic = null;
      state.isOnline = false;
      state.lastSeen = null;
    },
  },
});

export const { setUserProfileData, resetToDefault : resetUserToDefault } = userSlice.actions;
export default userSlice.reducer;
