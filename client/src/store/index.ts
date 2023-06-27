import { configureStore } from "@reduxjs/toolkit";

import messagesListReducer from "../features/Messages/messagesSlice";
import replyReducer from "../features/Reply/replySlice";
import usersReducer from "../features/Users/usersSlice";

import selfReducer from "./selfSlice";

export const store = configureStore({
  reducer: {
    messages: messagesListReducer,
    reply: replyReducer,
    self: selfReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
