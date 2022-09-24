import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { GetSheetInfo } from '../use-cases/dependencies/google-sheet';
import { User } from './data/user';

type UserGateway = {
  authorize: (userId: string) => E.Either<Error, User>;
  getAllUsers: () => User[];
  createSheetInfoGetter: (userId: string) => GetSheetInfo;
};

export const createUserGateway = (users: User[]): UserGateway => ({
  getAllUsers: () => users,
  authorize: (userId) =>
    pipe(
      users.find((u) => u.id === userId),
      E.fromNullable(new Error('Authorization failed!')),
    ),
  createSheetInfoGetter: (userId) => {
    const user = O.fromNullable(users.find((u) => u.id === userId));

    return (sequenceId) =>
      pipe(
        user,
        O.map((u) => u.sheetInfos),
        O.chain(A.findFirst((s) => s.sequenceId === sequenceId)),
        O.map((sheetInfo) => ({
          id: sheetInfo.sheetId,
          range: sheetInfo.range,
        })),
      );
  },
});
