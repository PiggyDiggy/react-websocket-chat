import { Epic, ofType } from "redux-observable";
import { catchError, from, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { getChannelMembers } from "@/api";
import { revertAll, type Actions } from "@/store";
import type { User, UserId } from "@/types";

export type UsersState = {
  ids: UserId[];
  collection: Record<UserId, User>;
  loading: boolean;
  error: string;
};

function sortIds({ ids, collection }: Pick<UsersState, "collection" | "ids">) {
  return [...ids].sort((a, b) => {
    const userA = collection[a];
    const userB = collection[b];
    if (userA.online && !userB.online) return -1;
    if (!userA.online && userB.online) return 1;
    return userA.name.localeCompare(userB.name);
  });
}

function findInsertIndex({ ids, collection }: Pick<UsersState, "collection" | "ids">, newUser: User) {
  for (let i = 0; i < ids.length; i++) {
    const user = collection[ids[i]];
    if (!user.online && newUser.online) {
      return i;
    }
    if (user.online === newUser.online) {
      if (user.name.localeCompare(newUser.name) > 0) {
        return i;
      }
    }
  }

  return ids.length;
}

const initialState: UsersState = {
  ids: [],
  collection: {},
  loading: false,
  error: "",
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    loadUsers: (state) => {
      state.loading = true;
      state.error = "";
    },
    loadUsersSuccess: (state, { payload }: PayloadAction<User[]>) => {
      const collection = payload.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as UsersState["collection"]);
      state.collection = collection;
      state.ids = sortIds({ ids: payload.map((user) => user.id), collection });
      state.loading = false;
    },
    loadUsersFail: (state, { payload }: PayloadAction<string>) => {
      state.loading = false;
      state.error = payload;
    },
    addUser: (state, { payload }: PayloadAction<User>) => {
      state.collection[payload.id] = payload;
      const index = findInsertIndex(state, payload);
      state.ids.splice(index, 0, payload.id);
    },
    removeUser: (state, { payload }: PayloadAction<UserId>) => {
      state.ids = state.ids.filter((id) => id !== payload);
      delete state.collection[payload];
    },
    setUserOnlineStatus: (state, { payload }: PayloadAction<Pick<User, "id" | "online">>) => {
      const user = state.collection[payload.id];
      if (!user) return;
      user.online = payload.online;
      state.ids = sortIds(state);
    },
  },
});

export const { loadUsers, loadUsersFail, loadUsersSuccess, addUser, removeUser, setUserOnlineStatus } =
  usersSlice.actions;

export const usersEpic: Epic<Actions> = (action$) =>
  action$.pipe(
    ofType(loadUsers.type),
    mergeMap(() => {
      return from(getChannelMembers()).pipe(mergeMap((users) => of(loadUsersSuccess(users))));
    }),
    catchError(() => of(loadUsersFail("Failed to load users")))
  );
