interface MessageBase {
  content: string;
  id: number;
  date?: string;
}

export interface UserMessage extends MessageBase {
  type: "msg";
  author: Omit<User, "online">;
  reply?: UserMessage;
}

export interface ServerMessage extends MessageBase {
  type: "info";
  author: "server";
}

export type Message = UserMessage | ServerMessage;

export type UserId = string;

export interface User {
  name: string;
  id: UserId;
  online: boolean;
}

export type ChannelData = { messages: Message[]; users: User[] };

interface SessionData {
  sessionId: string;
  user: User;
}

export interface ServerToClientEvents {
  "channel:new-member": (user: User) => void;
  "channel:member-leave": (userId: UserId) => void;
  "user:activity": (users: User[]) => void;
  "user:connect": (userId: UserId) => void;
  "user:disconnect": (userId: UserId) => void;
  session: (data: SessionData) => void;
  message: (message: Message) => void;
}

export interface ClientToServerEvents {
  "user:activity": (activity: string) => void;
  "user:join-channel": (username: string) => void;
  "user:leave-channel": () => void;
  "channel:get-data": (cb: (data: ChannelData) => void) => void;
  message: (message: Message) => void;
}
