import React from "react";
import { IServerMessage } from "../../types";
import css from "./ServerMessage.module.css";

type Props = {
  message: IServerMessage;
};

export const ServerMessage: React.FC<Props> = ({ message }) => {
  return <li className={css["info-message"]}>{message.content}</li>;
};
