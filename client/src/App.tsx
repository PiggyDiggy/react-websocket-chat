import { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";

import type { RootState } from "./store";
import { setUser } from "./store/selfSlice";
import { Chat } from "./pages/Chat";
import { Login } from "./pages/Login";

const SocketContext = createContext<Socket | null>(null);
const address = process.env.NODE_ENV === "development" ? "//:8080" : "";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.self.user);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("chat-session-id");
    if (!sessionId) return;

    const socket = io(address, { auth: { sessionId } });
    socket.on("session", ({ user }) => dispatch(setUser(user)));
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on("disconnect", () => dispatch(setUser(null)));

    return () => {
      socket.off("disconnect");
    };
  }, [socket, dispatch]);

  function handleLogin(username: string) {
    const socket = io(address, { auth: { username } });
    socket.on("session", ({ user, sessionId }) => {
      dispatch(setUser(user));
      localStorage.setItem("chat-session-id", sessionId);
    });
    setSocket(socket);
  }

  function handleLogout() {
    socket?.emit("user:disconnect");
    localStorage.removeItem("chat-session-id");
    dispatch(setUser(null));
  }

  return (
    <>
      {user ? (
        <SocketContext.Provider value={socket}>
          <Chat handleLogout={handleLogout} />
        </SocketContext.Provider>
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </>
  );
};

export { SocketContext };

export default App;
