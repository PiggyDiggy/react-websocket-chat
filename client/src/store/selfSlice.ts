import { Epic, combineEpics, ofType } from "redux-observable";
import { EMPTY, catchError, from, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { loadMessages } from "@/features/Messages/messagesSlice";
import { loadUsers } from "@/features/Users/usersSlice";
import { getUserBySessionId, createUser as apiCreateUser } from "@/api";
import type { User } from "@/types";

import { revertAll, init, type Actions } from ".";

export type UserState = {
  user: User | null;
  loading: boolean;
  error: string;
  loggedIn: boolean;
};

const getInitialState = (): UserState => ({
  user: null,
  loading: false,
  error: "",
  loggedIn: Boolean(localStorage.getItem("chat-session-id")),
});

export const selfUserSlice = createSlice({
  name: "self",
  initialState: getInitialState(),
  extraReducers: (builder) =>
    builder.addCase(revertAll, () => {
      localStorage.removeItem("chat-session-id");
      return getInitialState();
    }),
  reducers: {
    loadUser: (state, { payload }: PayloadAction<string | null>) => {
      if (payload) {
        state.loading = true;
        state.error = "";
      }
    },
    loadUserSuccess: (state, { payload }: PayloadAction<User | null>) => {
      state.user = payload;
      state.loading = false;
      state.loggedIn = true;
    },
    loadUserFail: (state, { payload }: PayloadAction<string>) => {
      state.loading = false;
      state.loggedIn = false;
      state.error = payload;
    },
    createUser: (state, _: PayloadAction<string>) => state,
  },
});

export const { loadUser, loadUserFail, loadUserSuccess, createUser } = selfUserSlice.actions;

const loadUserEpic: Epic<Actions> = (action$) =>
  action$.pipe(
    ofType(loadUser.type),
    mergeMap(({ payload }) => {
      if (!payload) {
        return EMPTY;
      }
      return from(getUserBySessionId(payload)).pipe(
        mergeMap((user) => of(loadUserSuccess(user), loadMessages(), loadUsers()))
      );
    }),
    catchError(() => of(loadUserFail("Failed to load user")))
  );

const createUserEpic: Epic<Actions> = (action$) =>
  action$.pipe(
    ofType(createUser.type),
    mergeMap(({ payload }) =>
      from(apiCreateUser(payload)).pipe(
        mergeMap((sessionId) => {
          localStorage.setItem("chat-session-id", sessionId);
          return of(loadUser(sessionId));
        })
      )
    )
  );

const initEpic: Epic<Actions> = (action$) =>
  action$.pipe(
    ofType(init.type),
    mergeMap(() => of(loadUser(localStorage.getItem("chat-session-id"))))
  );

export const selfUserEpic = combineEpics(loadUserEpic, createUserEpic, initEpic);
