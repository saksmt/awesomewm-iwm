export enum LogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
  Off,
}

export const logConfig = {
  logDirectory: os.getenv('HOME') + '/.log/awesomewm',
  loggers: {
    '<root>': LogLevel.Info,
  } as Record<string, LogLevel>,
  writeInFile: true,
};
