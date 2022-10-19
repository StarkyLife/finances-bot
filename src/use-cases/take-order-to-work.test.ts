import * as E from 'fp-ts/Either';
import { constVoid } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

import { takeOrderToWorkUsecase } from './take-order-to-work';

it('should return error when wb api fails', async () => {
  const ERROR = new Error('Failed to change status!');

  const orderId = 'orderId';
  const changeWBOrderStatus = jest.fn().mockReturnValue(TE.left(ERROR));

  const result = await takeOrderToWorkUsecase(changeWBOrderStatus, orderId)();

  expect(E.toUnion(result)).toEqual(ERROR);
});

it('should resolve', async () => {
  const orderId = 'orderId';
  const changeWBOrderStatus = jest.fn().mockReturnValue(TE.right(constVoid()));

  const result = await takeOrderToWorkUsecase(changeWBOrderStatus, orderId)();

  expect(E.isRight(result)).toBe(true);
});
