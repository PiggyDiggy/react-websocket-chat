type Message = {
  type: "info" | "msg";
  content: string;
  author: "server" | User;
  date?: string;
  id?: number;
};

type User = {
  name: string;
  id: string;
  online: boolean;
};

type Data = { messages: Message[]; users: Record<string, User> };

export type { Message, User, Data };
