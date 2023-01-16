import React, { useRef } from "react";

type Props = {
  handleLogin: (name: string) => void;
};

export const Login: React.FC<Props> = ({ handleLogin }) => {
  const input = useRef<HTMLInputElement>(null);

  function login() {
    const nickname = input.current?.value;
    if (!nickname) return;

    handleLogin(nickname);
  }

  return (
    <section>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="nickname">Nickname: </label>
        <input type="text" id="nickname" ref={input} autoComplete="off" />
        <div>
          <button onClick={login} type="submit">
            Join Chat
          </button>
        </div>
      </form>
    </section>
  );
};
