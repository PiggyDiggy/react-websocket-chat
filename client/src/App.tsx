import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Chat } from "./pages/Chat";
import { Login } from "./pages/Login";
import { User } from "./types";

const SocketContext = createContext<Socket | null>(null);
const UserContext = createContext<User | null>(null);
const address = process.env.NODE_ENV === "development" ? "//:8080" : "";

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("chat-session-id");
    if (!sessionId) return;

    const socket = io(address, { auth: { sessionId } });
    socket.on("session", ({ user }) => setUser(user));
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("disconnect", () => setUser(null));

    return () => {
      socket.off("disconnect");
    };
  }, [socket]);

  function handleLogin(username: string) {
    const socket = io(address, { auth: { username } });
    socket.on("session", ({ user, sessionId }) => {
      setUser(user);
      localStorage.setItem("chat-session-id", sessionId);
    });
    setSocket(socket);
  }

  function handleLogout() {
    socket?.emit("user-disconnect");
    localStorage.removeItem("chat-session-id");
    setUser(null);
  }

  return (
    <>
      {user ? (
        <SocketContext.Provider value={socket}>
          <UserContext.Provider value={user}>
            <Chat handleLogout={handleLogout} />
          </UserContext.Provider>
        </SocketContext.Provider>
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </>
  );
};

export { SocketContext, UserContext };

export default App;
