import { createLogger, format, transports } from "winston";

const isProd = process.env.NODE_ENV === "production";

const consoleTransport = new transports.Console({
  level: isProd ? "info" : "debug",
});

const errorFileTransport = new transports.File({ filename: "error.log", level: "error" });
const combinedFileTransport = new transports.File({ filename: "combined.log" });

const logger = createLogger({
  level: isProd ? "info" : "debug",
  format: isProd
    ? format.combine(format.timestamp(), format.errors({ stack: true }), format.json())
    : format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ level, message, timestamp, stack, ...meta }) => {
          const base = `${timestamp} ${level}: ${message}`;
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return stack ? `${base}\n${stack}${metaStr}` : `${base}${metaStr}`;
        })
      ),
  transports: [consoleTransport, errorFileTransport, combinedFileTransport],
  exitOnError: false,
});

export default logger;
