import { User, UserId } from "./types";

export class UserStore {
  users: Map<UserId, User>;
  sessionIdToUserId: Map<string, UserId>;
  typingUsers: Set<User>;

  constructor() {
    this.users = new Map();
    this.sessionIdToUserId = new Map();
    this.typingUsers = new Set();
  }

  getUserId(sessionId: string): UserId | undefined {
    return this.sessionIdToUserId.get(sessionId);
  }

  getUser(userId: UserId): User | undefined {
    return this.users.get(userId);
  }

  getUserBySessionId(sessionId: string) {
    return this.getUser(this.getUserId(sessionId));
  }

  saveUser(sessionId: string, user: User) {
    this.users.set(user.id, user);
    this.sessionIdToUserId.set(sessionId, user.id);
  }

  removeUser(sessionId: string) {
    this.users.delete(this.getUserId(sessionId));
    this.sessionIdToUserId.delete(sessionId);
  }

  findAllUsers() {
    return Array.from(this.users.values());
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
