import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { revertAll } from "@/store";
import type { IUserMessage } from "@/types";

export type ReplyState = {
  message: IUserMessage | null;
};

const initialState: ReplyState = {
  message: null,
};

export const replySlice = createSlice({
  name: "reply",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    setReply: (state, action: PayloadAction<IUserMessage | null>) => {
      state.message = action.payload;
    },
  },
});

export const { setReply } = replySlice.actions;
