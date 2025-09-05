import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomId: null,
  friendId: null,
  friendProfilePic: null,
  friendName: null,
  isOnline: false,
  lastSeen: null,
  lastMessageAt: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload.roomId;
      state.friendId = action.payload.friendId;
      state.friendName = action.payload.friendName;
      state.friendProfilePic = action.payload.friendProfilePic;
      state.isOnline = action.payload.isOnline;
      state.lastSeen = action.payload.lastSeen;
      state.messages = []; 
    },
    addMessage: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.messages = action.payload;
      } else {
        state.messages.push(action.payload);
      }
    },
    updateLastMessageAt: (state, action) => {
      state.lastMessageAt = action.payload;
    },
    resetToDefault: (state) => {
      state.roomId = null;
      state.friendId = null;
      state.friendName = null;
      state.friendProfilePic = null;
      state.isOnline = false;
      state.lastSeen = null;
      state.messages = [];
    },
  },
});

export const {
  setRoomId,
  addMessage,
  updateLastMessageAt,
  resetToDefault: resetChatToDefault,
} = chatSlice.actions;
export default chatSlice.reducer;
