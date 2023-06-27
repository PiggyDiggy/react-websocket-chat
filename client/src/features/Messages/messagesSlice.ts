import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { revertAll } from "@/store";
import type { IMessage, IUserMessage } from "@/types";

export type MessagesState = {
  list: IMessage[];
};

const initialState: MessagesState = {
  list: [],
};

type PushMessagePayload = PayloadAction<IMessage | Omit<IUserMessage, "id">>;

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    replaceMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.list = action.payload;
    },
    pushMessage: (state, action: PushMessagePayload) => {
      const message = { ...action.payload, id: state.list.length };
      state.list.push(message);
    },
  },
});

export const { replaceMessages, pushMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
