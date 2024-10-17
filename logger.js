import { createLogger, format, transports } from "winston";

const { combine, timestamp, json, colorize, printf } = format;

const consoleLogFormat = combine(
  colorize(),
  printf(({ level, message, timestamp }) => {
    return `${level}: ${message} [${timestamp}]`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

export default logger;