interface Message {
  content: string;
  date?: string;
  id?: number;
}

interface IUserMessage extends Message {
  type: "msg";
  author: User;
  reply?: IUserMessage;
}

interface IServerMessage extends Message {
  type: "info";
  author: "server";
}

type IMessage = IUserMessage | IServerMessage;

type User = {
  name: string;
  id: string;
  online: boolean;
};

type ServerData = { messages: IMessage[]; users: User[] };

export type { IMessage, IUserMessage, IServerMessage, User, ServerData };
