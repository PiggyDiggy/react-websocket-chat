import { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";

import type { ClientToServerEvents, ServerToClientEvents } from "../../server/types";
import { Preloader } from "./components/Preloader";
import { revertAll, type RootState } from "./store";
import { setUser } from "./store/selfSlice";
import { Chat } from "./pages/Chat";
import { Login } from "./pages/Login";

type SocketWithEvents = Socket<ServerToClientEvents, ClientToServerEvents>;

const SocketContext = createContext<SocketWithEvents | null>(null);
const address = process.env.NODE_ENV === "development" ? "//:8080" : "";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.self.user);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<SocketWithEvents | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("chat-session-id");
    const socket: SocketWithEvents = io(address, { auth: { sessionId } });

    setSocket(socket);

    socket.on("connect", () => {
      setConnected(true);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("session", ({ sessionId, user }) => {
      dispatch(setUser(user));
      localStorage.setItem("chat-session-id", sessionId);
    });
    socket.on("channel:member-leave", (userId) => {
      if (userId === user?.id) {
        dispatch(revertAll());
      }
    });
  }, [dispatch, socket, user?.id]);

  return (
    <SocketContext.Provider value={socket}>
      <Preloader loading={!connected}>
        {user ? <Chat /> : <Login />}
      </Preloader>
    </SocketContext.Provider>
  );
};

export { SocketContext };

export default App;
