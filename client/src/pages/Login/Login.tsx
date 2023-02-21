import React, { ChangeEvent, useEffect, useRef } from "react";
import css from "./Login.module.css";

type Props = {
  handleLogin: (name: string) => void;
};

export const Login: React.FC<Props> = ({ handleLogin }) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  function login() {
    const nickname = input.current?.value;
    if (!nickname) return;

    handleLogin(nickname);
  }

  function resize() {
    const target = input.current as HTMLInputElement;
    const borderWidth = Number(
      getComputedStyle(target).borderWidth.slice(0, -2)
    );
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={css["button__login-icon"]}
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <g className={css.icon__arrow}>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </g>
          </svg>
        </button>
      </form>
    </section>
  );
};
