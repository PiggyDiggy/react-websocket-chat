import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { User, UserId } from "@/types";

export type UsersState = {
  ids: UserId[];
  collection: Record<UserId, User>;
};

function sortIds({ ids, collection }: UsersState) {
  return [...ids].sort((a, b) => {
    const userA = collection[a];
    const userB = collection[b];
    if (userA.online && !userB.online) return -1;
    if (!userA.online && userB.online) return 1;
    return userA.name.localeCompare(userB.name);
  });
}

function findInsertIndex({ ids, collection }: UsersState, newUser: User) {
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
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, { payload }: PayloadAction<User[]>) => {
      const collection = payload.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as UsersState["collection"]);
      state.collection = collection;
      state.ids = sortIds({ ids: payload.map((user) => user.id), collection });
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

export const { setUsers, addUser, removeUser, setUserOnlineStatus } = usersSlice.actions;

export default usersSlice.reducer;
