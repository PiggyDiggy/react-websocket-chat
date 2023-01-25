import React, { useRef, useEffect } from "react";
import { cx } from "../../utils";
import css from "./Textarea.module.css";

type Props = {
  value: string;
  setValue: (val: string) => void;
  submit?: () => void;
  className?: string;
  placeholder?: string;
};

type TextArea = HTMLTextAreaElement;

export const Textarea: React.FC<Props> = ({
  placeholder,
  className,
  value,
  setValue,
  submit,
}) => {
  const textareaRef = useRef<TextArea>(null);

  useEffect(() => {
    const textarea = textareaRef.current as TextArea;
    const handleInput = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit?.();
      }
    };

    textarea.addEventListener("keydown", handleInput);
    return () => textarea.removeEventListener("keydown", handleInput);
  }, [submit]);

  useEffect(() => {
    const textarea = textareaRef.current as TextArea;

    function resize(target: TextArea) {
      const borderWidth = Number(
        getComputedStyle(target).borderWidth.slice(0, -2)
      );
      target.style.height = "0px";
      target.style.height = `${target.scrollHeight + borderWidth * 2}px`;
    }

    resize(textarea);
  }, [value]);

  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={cx(className, css.textarea)}
      placeholder={placeholder}
      ref={textareaRef}
      autoComplete="off"
    />
  );
};
