import { User } from "./types";

export class UserStore {
  users: Record<string, User>;
  typingUsers: Set<User>;

  constructor() {
    this.users = {};
    this.typingUsers = new Set();
  }

  findUser(sessionId: string): User | undefined {
    return this.users[sessionId];
  }

  saveUser(sessionId: string, user: User) {
    this.users[sessionId] = user;
  }

  findAllUsers() {
    return Object.values(this.users);
  }

  addTypingUser(user: User) {
    if (this.typingUsers.has(user)) return;
    this.typingUsers.add(user);
  }

  removeTypingUser(user: User) {
    this.typingUsers.delete(user);
  }

  getTypingUsers() {
    return Array.from(this.typingUsers);
  }
}
