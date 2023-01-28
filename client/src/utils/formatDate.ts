type Args = { date: string; format: "long" | "short" };

export const formatDate = ({ date, format }: Args) => {
  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }
      : {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        };
  return new Date(date).toLocaleString("en-US", options);
};
