import { User } from "./types";

export class UserStore {
  users: Record<string, User>;

  constructor() {
    this.users = {};
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
}
