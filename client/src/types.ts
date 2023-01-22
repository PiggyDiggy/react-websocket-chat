interface Message {
  content: string;
  date?: string;
  id?: number;
}

interface IUserMessage extends Message {
  type: "msg";
  author: User;
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

export type { IMessage, IUserMessage, IServerMessage, User };
