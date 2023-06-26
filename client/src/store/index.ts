import { configureStore } from "@reduxjs/toolkit";

import messagesListReducer from "../features/Messages/messagesSlice";
import replyReducer from "../features/Reply/replySlice";

export const store = configureStore({
  reducer: {
    messages: messagesListReducer,
    reply: replyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
