import { Singleton } from "typescript-ioc";
import chalk from 'chalk';

const errorMap = Object.freeze({
  error: console.error,
  warn: console.warn,
  info: console.log,
});

type AditionalLogInformation = {
  who: string,
  when: string,
  why: string,
}

@Singleton
export class Logger {
  log(level: string, message: string, color: chalk.Chalk) {
    errorMap[level](color(message));
  }

  buildMessage(where: string, what: string, aditionalInfo?: AditionalLogInformation) {
    return `${chalk.bold(`[${where.toUpperCase()}]`)} ${what}`;
  }

  error(where: string, what: string, aditionalInfo?: AditionalLogInformation) {
    const red = chalk.rgb(255, 77, 98);
    return this.log(
      'error',
      this.buildMessage(where, what, aditionalInfo),
      red
    );
  }

  warn(where: string, what: string, aditionalInfo?: AditionalLogInformation) {
    const orange = chalk.rgb(255, 171, 112);
    return this.log(
      'warn',
      this.buildMessage(where, what, aditionalInfo),
      orange,
    );
  }

  info(where: string, what: string, aditionalInfo?: AditionalLogInformation) {
    const orange = chalk.rgb(255, 171, 112);
    return this.log(
      'warn',
      this.buildMessage(where, what, aditionalInfo),
      chalk.reset,
    );
  }
}