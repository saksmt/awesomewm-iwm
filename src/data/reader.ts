export class Reader<C, T> {
  constructor(readonly run: (context: C) => T) {}

  map<R>(f: (arg: T) => R): Reader<C, R> {
    return new Reader((context) => f(this.run(context)));
  }

  flatMap<R>(f: (arg: T) => Reader<C, R>): Reader<C, R> {
    return new Reader((context) => f(this.run(context)).run(context));
  }

  then<R>(other: Reader<C, R>): Reader<C, R> {
    return this.flatMap((_) => other);
  }

  static ask<C>(): Reader<C, C> {
    return new Reader<C, C>((it) => it);
  }

  static asks<C, R>(f: (c: C) => R): Reader<C, R> {
    return new Reader<C, R>(f);
  }

  static local<CC, R>(l: Reader<CC, R>): <C>(f: (c: C) => CC) => Reader<C, R> {
    return (f) => new Reader((ctx) => l.run(f(ctx)));
  }
}
