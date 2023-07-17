import { useState, useCallback, createContext } from "react";

import { Header } from "@/features/Header";
import { MessagesList } from "@/features/Messages";
import { useSocketState, type SocketWithEvents } from "@/hooks/useSocketState";
import { Composer } from "@/components/Composer";
import { Sidebar } from "@/components/Sidebar";

import css from "./Chat.module.css";

const SocketContext = createContext<SocketWithEvents | null>(null);

export const Chat = () => {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const socket = useSocketState();

  const openSidebar = useCallback(() => {
    setSidebarOpened(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpened(false);
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Header openSidebar={openSidebar} />
      <main className={css.chat}>
        <MessagesList />
        <Composer />
      </main>
      <Sidebar opened={sidebarOpened} closeSidebar={closeSidebar} />
    </SocketContext.Provider>
  );
};

export { SocketContext };
