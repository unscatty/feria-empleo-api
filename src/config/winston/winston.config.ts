import * as dotenv from "dotenv";
import winston from "winston";
import { colors } from "./winston.constants";

dotenv.config();

winston.addColors(colors);

const winstonLog = winston.createLogger({
    level: process.env.LOGLEVEL,
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    winstonLog.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({
          all: true
        }),
        winston.format.printf(
          info => `${info.level} : ${info.message}`
      )
      )
    }));
  }

  export { winstonLog };