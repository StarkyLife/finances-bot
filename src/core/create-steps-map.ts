import { fromNullable } from '@sweet-monads/maybe';

import { StepsMap } from './data/steps-map';

export type RealStepsMap<T> = StepsMap<T> & { internalData: Map<string, T> };

export const createStepsMap = <T>(data: Map<string, T>): RealStepsMap<T> => {
  return {
    internalData: data,
    getBy: (id) => fromNullable(data.get(id)),
  };
};
