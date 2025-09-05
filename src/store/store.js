import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
});

// Wrapper for the store to reset the state
const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined;
  }

  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
export const persistor = persistStore(store);
