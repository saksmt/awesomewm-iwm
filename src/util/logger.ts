import { debug } from 'gears';
import { option } from '../data/index';
import { logConfig, LogLevel } from '../log-config';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class Logger {
  private readonly parentLoggers: string[];

  constructor(private readonly name: string) {
    this.parentLoggers = name
      .split('\n')
      .reduce((prev, current) => [...prev, prev + '.' + current], [] as string[])
      .reverse();
  }

  private writeRaw(data: string): void {
    if (logConfig.writeInFile) {
      const [h] = io.open(`${logConfig.logDirectory}/${currentDate}.log`, 'a') as [LuaFile];
      (h as LuaFile).write(data + '\n');
      h.flush();
      h.close();
    } else {
      print(data + '\n');
    }
  }

  private write(message: string, level: string, context: any[]): void {
    this.writeRaw(`[${level.toUpperCase()}] ${this.name}: ${message}`);
    context.forEach((value, index) => {
      const valueDump = debug.dump_return(value, null, 10);
      this.writeRaw(
        ` #${index}: ${valueDump
          .split('\n')
          .map((it) => '   ' + it)
          .join('\n')}`,
      );
    });
  }

  private logLevel(): LogLevel {
    return option(this.parentLoggers.find((it) => logConfig.loggers[it] != null))
      .map((it) => logConfig.loggers[it])
      .getOrElse(logConfig.loggers['<root>']);
  }

  trace(message: string, context?: any[]): void {
    if (this.logLevel() <= LogLevel.Trace) {
      this.write(message, 'trace', context ?? []);
    }
  }

  debug(message: string, context?: any[]): void {
    if (this.logLevel() <= LogLevel.Debug) {
      this.write(message, 'debug', context ?? []);
    }
  }

  info(message: string, context?: any[]): void {
    if (this.logLevel() <= LogLevel.Info) {
      this.write(message, 'info', context ?? []);
    }
  }

  warn(message: string, context?: any[]): void {
    if (this.logLevel() <= LogLevel.Warn) {
      this.write(message, 'warn', context ?? []);
    }
  }

  error(message: string, context?: any[]): void {
    if (this.logLevel() <= LogLevel.Error) {
      this.write(message, 'error', context ?? []);
    }
  }
}
/* eslint-enable */

const currentDate = os.date('%y.%m.%d_%H');
