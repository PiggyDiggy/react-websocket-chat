type ClassNames = Array<string | undefined | Record<string, boolean>>;

export const cx = (...classnames: ClassNames) => {
  let result = [];

  for (const el of classnames) {
    if (typeof el === "string") {
      result.push(el);
    } else if (typeof el === "object" && el !== null) {
      for (const className in el) {
        if (el[className]) {
          result.push(className);
        }
      }
    }
  }

  return result.join(" ");
};
