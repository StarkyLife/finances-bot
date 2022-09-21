import * as O from 'fp-ts/Option';

import { StepsMap } from './data/steps-map';

export type RealStepsMap<T> = StepsMap<T> & { internalData: Map<string, T> };

export const createStepsMap = <T>(data: Map<string, T>): RealStepsMap<T> => {
  return {
    internalData: data,
    getBy: (id) => O.fromNullable(data.get(id)),
  };
};
