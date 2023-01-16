import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Chat } from "./pages/Chat";
import { Login } from "./pages/Login";
import { User } from "./types";

const SocketContext = createContext<Socket | null>(null);

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const address = process.env.NODE_ENV === "development" ? "//:8080" : "";
    const socket = io(address);
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  function handleLogin(name: string) {
    if (!socket) return;

    const user: User = {
      name,
      id: socket.id,
      online: true,
    };
    setUser(user);
  }

  function handleLogout() {
    socket?.emit("user-disconnect", user);
    setUser(null);
  }

  return (
    <>
      {user ? (
        <SocketContext.Provider value={socket}>
          <Chat user={user} handleLogout={handleLogout} />
        </SocketContext.Provider>
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </>
  );
};

export { SocketContext };

export default App;
