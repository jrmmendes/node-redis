import { Singleton } from "typescript-ioc";
import chalk from 'chalk';

const errorMap = Object.freeze({
  error: console.error,
  warn: console.warn,
  info: console.log,
});

type LoggableError = {
  who: string,
  what: string,
  where: string,
  when: string,
  why: string,
}

@Singleton
export class Logger {
  log(level: string, message: string) {
    errorMap[level](message);
  }

  error(log: LoggableError) {
    const message = chalk.bold(`[${log.what}])
    return log('error');
  }
}