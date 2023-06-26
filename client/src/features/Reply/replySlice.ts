import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { IUserMessage } from "@/types";

export type ReplyState = {
  message: IUserMessage | null;
};

const initialState: ReplyState = {
  message: null,
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setReply: (state, action: PayloadAction<IUserMessage | null>) => {
      state.message = action.payload;
    },
  },
});

export const { setReply } = replySlice.actions;

export default replySlice.reducer;
