import { debug } from 'gears';
import { option } from '../data';
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
      const h = assert(
        ...(io.open(`${logConfig.logDirectory}/${currentDate}.log`, 'a') as unknown as [
          LuaFile | undefined,
          string,
        ]),
      ) as unknown as LuaFile;
      h.write(data + '\n');
      h.flush();
      h.close();
    } else {
      print(data + '\n');
    }
  }

  private write(message: string, level: string, context: unknown[]): void {
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

  /**
   * @TupleReturn
   */
  private static hackCastToLuaTable(v: any): any {
    return v;
  }

  /**
   * Logs message before failing with lua's assert
   * Expects assertible to be unpacked lua table, if tstl-typed value is annotated with TupleReturn
   * pass such value via spread operator
   */
  assert<T>(message: string, assertible: any): T {
    const [v, f] = Logger.hackCastToLuaTable(assertible) as unknown as [T | undefined, string];
    if (v) {
      return v as T;
    } else {
      this.error(`${message}: ${f}`);
      assert(assertible);
      throw 'cant be';
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
