import { useEffect, useRef, useContext } from "react";

import { SocketContext } from "@/App";
import { LoginIcon } from "@/components/Icons/LoginIcon";

import css from "./Login.module.css";

export const Login = () => {
  const input = useRef<HTMLInputElement>(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    input.current?.focus();
  }, []);

  function login() {
    const nickname = input.current?.value;
    if (!nickname) return;

    socket?.emit("user:join-channel", nickname);
  }

  function resize() {
    const target = input.current as HTMLInputElement;
    const borderWidth = Number(getComputedStyle(target).borderWidth.slice(0, -2));
    target.style.width = "0px";
    target.style.width = `${target.scrollWidth + borderWidth * 2}px`;
  }

  return (
    <section className={css.wrapper}>
      <h1 className={css.title}>Websocket Chat</h1>
      <form className={css.form} onSubmit={(e) => e.preventDefault()}>
        <div className={css["input-wrapper"]}>
          <input
            className={css.input}
            type="text"
            id="nickname"
            ref={input}
            autoComplete="off"
            maxLength={30}
            onChange={resize}
            required
          />
          <label className={css.input__label} htmlFor="nickname">
            Nickname
          </label>
        </div>
        <button className={css.button} onClick={login} type="submit">
          <span>Join</span>
          <LoginIcon className={css["button__login-icon"]} arrowClassName={css.icon__arrow} />
        </button>
      </form>
    </section>
  );
};
