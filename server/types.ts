interface Message {
  type: "info" | "msg";
  content: string;
  author: "server" | User;
  reply?: Message;
  date?: string;
  id?: number;
}

interface User {
  name: string;
  id: string;
  online: boolean;
}

type Data = { messages: Message[]; users: User[] };

export type { Message, User, Data };
