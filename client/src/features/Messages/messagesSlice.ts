import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { type Epic, ofType } from "redux-observable";
import { mergeMap } from "rxjs/operators";
import { of, from, catchError } from "rxjs";

import { getMessages } from "@/api";
import { revertAll, type Actions } from "@/store";
import type { IMessage, IUserMessage } from "@/types";

export type MessagesState = {
  loading: boolean;
  list: IMessage[];
  error: string;
};

const initialState: MessagesState = {
  loading: false,
  list: [],
  error: "",
};

type PushMessagePayload = PayloadAction<IMessage | Omit<IUserMessage, "id">>;

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    loadMessages: (state) => {
      state.loading = true;
      state.error = "";
    },
    loadMessagesSuccess: (state, action: PayloadAction<IMessage[]>) => {
      state.loading = false;
      state.list = action.payload;
    },
    loadMessagesFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    pushMessage: (state, action: PushMessagePayload) => {
      const message = { ...action.payload, id: state.list.length };
      state.list.push(message);
    },
  },
});

export const { loadMessages, loadMessagesFail, loadMessagesSuccess, pushMessage } = messagesSlice.actions;

export const messagesEpic: Epic<Actions> = (action$) =>
  action$.pipe(
    ofType(loadMessages.type),
    mergeMap(() => {
      return from(getMessages()).pipe(mergeMap((messages) => of(loadMessagesSuccess(messages))));
    }),
    catchError(() => of(loadMessagesFail("Failed to load messages")))
  );
