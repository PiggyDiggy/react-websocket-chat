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
}

export type { Message, User };
