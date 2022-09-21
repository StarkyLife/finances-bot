import * as O from 'fp-ts/Option';

export type StepsMap<T> = {
  getBy(id: string): O.Option<T>;
};
