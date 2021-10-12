import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error'; // it's really handy to make your life easier
import * as winston from 'winston';
import { Logger, LoggerOptions } from 'winston';

export class CustomLogger {
  private readonly logger: Logger;
  private readonly prettyError = new PrettyError();
  public static loggerOptions: LoggerOptions = {
    transports: [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  };
  constructor(private context: string, transport?) {
    this.logger = (winston as any).createLogger(CustomLogger.loggerOptions);
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }

  get Logger(): Logger {
    return this.logger; // idk why i have this in my code !
  }
  static configGlobal(options?: LoggerOptions) {
    this.loggerOptions = options;
  }

  public log(message: string): void {
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('info', message);
  }

  public error(message: string, trace?: any): void {
    const currentDate = new Date();
    // i think the trace should be JSON Stringified
    this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('error', message, trace);
  }

  public warn(message: string): void {
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.formatedLog('warn', message);
  }

  public overrideOptions(options: LoggerOptions): void {
    this.logger.configure(options);
  }
  // this method just for printing a cool log in your terminal , using chalk
  private formatedLog(level: string, message: string, error?: Error): void {
    let result = '';
    const color = chalk;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    switch (level) {
      case 'info':
        result = `[${color.blue('INFO')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context
        )}] ${message}`;
        break;
      case 'error':
        result = `[${color.red('ERR')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context
        )}] ${message}`;
        if (error && process.env.NODE_ENV !== 'production') this.prettyError.render(error, true);
        break;
      case 'warn':
        result = `[${color.yellow('WARN')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context
        )}] ${message}`;
        break;
      default:
        break;
    }
    console.log(result);
  }
}
