import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";

import { UsersList } from "@/features/Users";

import css from "./Sidebar.module.css";

type Props = {
  opened: boolean;
  closeSidebar: () => void;
};

export const Sidebar: React.FC<Props> = ({ opened, closeSidebar }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={opened}
      timeout={200}
      nodeRef={sidebarRef}
      mountOnEnter
      classNames={{
        enter: css["sidebar-enter"],
        enterActive: css["sidebar-enter-active"],
        enterDone: css["sidebar--opened"],
        exitActive: css["sidebar-exit-active"],
        exitDone: css["sidebar--hidden"],
      }}
    >
      <div className={css.wrapper}>
        <aside ref={sidebarRef} className={css.sidebar}>
          <UsersList />
        </aside>
        <div onClick={closeSidebar} className={css.backdrop}></div>
      </div>
    </CSSTransition>
  );
};
