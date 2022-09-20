import { Maybe } from '@sweet-monads/maybe';

export type StepsMap<T> = {
  getBy(id: string): Maybe<T>;
};
