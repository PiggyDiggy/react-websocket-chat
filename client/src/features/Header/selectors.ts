import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store";

const selectIds = (state: RootState) => state.users.ids;

const selectUsersCollection = (state: RootState) => state.users.collection;

export const selectActiveUsersCount = createSelector(
  [selectIds, selectUsersCollection],
  (ids, collection) => ids.filter((id) => collection[id].online).length
);
