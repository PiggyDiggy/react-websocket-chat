import { combineEpics, createEpicMiddleware } from "redux-observable";
import { configureStore, createAction } from "@reduxjs/toolkit";

import { ActionsSet } from "@/types";

import { messagesEpic, messagesSlice } from "../features/Messages/messagesSlice";
import { replySlice } from "../features/Reply/replySlice";
import { usersSlice, usersEpic } from "../features/Users/usersSlice";

import { selfUserSlice, selfUserEpic } from "./selfSlice";

export const revertAll = createAction("revertAll");
export const init = createAction("init");

export type Actions = ActionsSet<
  typeof messagesSlice.actions &
    typeof replySlice.actions &
    typeof selfUserSlice.actions &
    typeof usersSlice.actions & { revertAll: typeof revertAll; init: typeof init }
>;

const epicMiddleware = createEpicMiddleware<Actions>();

export const store = configureStore({
  reducer: {
    messages: messagesSlice.reducer,
    reply: replySlice.reducer,
    self: selfUserSlice.reducer,
    users: usersSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
});

const rootEpic = combineEpics<Actions>(messagesEpic, usersEpic, selfUserEpic);

epicMiddleware.run(rootEpic);

store.dispatch(init());

export type RootState = ReturnType<typeof store.getState>;
