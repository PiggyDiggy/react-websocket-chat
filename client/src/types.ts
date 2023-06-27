interface Message {
  content: string;
  id: number;
  date?: string;
}

interface IUserMessage extends Message {
  type: "msg";
  author: Omit<User, "online">;
  reply?: IUserMessage;
}

interface IServerMessage extends Message {
  type: "info";
  author: "server";
}

type IMessage = IUserMessage | IServerMessage;

type UserId = string;

type User = {
  id: UserId;
  name: string;
  online: boolean;
};

type ServerData = { messages: IMessage[]; users: User[] };

export type { IMessage, IUserMessage, IServerMessage, User, ServerData, UserId };
