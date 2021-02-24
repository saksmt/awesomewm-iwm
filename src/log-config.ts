export enum LogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
  Off,
}

export const logConfig = {
  logDirectory: '~/.log/awesomewm',
  loggers: {
    '<root>': LogLevel.Info,
  } as Record<string, LogLevel>,
  writeInFile: true,
};
