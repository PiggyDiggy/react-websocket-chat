import type { User, IMessage } from "@/types";

const BASE_URL = `http://${window.location.host}/api`;

async function request(pathname: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL}/${pathname}`, options);
  if (!response.ok) {
    throw new Error((await response.json())?.error);
  }
  return await response.json();
}

export async function getUserBySessionId(sessionId: string): Promise<User> {
  return await request(`session/${sessionId}`);
}

export async function createUser(username: string): Promise<string> {
  return await request("user/create", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username }),
  });
}

export async function getMessages(): Promise<IMessage[]> {
  return await request("channel/messages");
}

export async function getChannelMembers(): Promise<User[]> {
  return await request("channel/members");
}
