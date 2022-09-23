import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { GetSheetInfo } from '../use-cases/dependencies/google-sheet';
import { User } from './data/user';

type UserGateway = {
  authorize: (userId: string) => User;
  getAllUsers: () => User[];
  createSheetInfoGetter: (userId: string) => GetSheetInfo;
};

export const createUserGateway = (users: User[]): UserGateway => ({
  getAllUsers: () => users,
  authorize: (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('Authorization failed!');
    return user;
  },
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
