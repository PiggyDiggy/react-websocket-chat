import { Action } from "@reduxjs/toolkit";

export type {
  User,
  UserId,
  Message as IMessage,
  UserMessage as IUserMessage,
  ServerMessage as IServerMessage,
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../server/types";

export type Actions<A extends Record<string, () => Action>> = { [K in keyof A]: ReturnType<A[K]> };

export type ActionsSet<A extends {}> = Actions<A>[keyof A];
