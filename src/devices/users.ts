import { just, none } from '@sweet-monads/maybe';

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
    const user = users.find((u) => u.id === userId);

    return (sequenceId) => {
      const sheetInfo = user?.sheetInfos.find((i) => i.sequenceId === sequenceId);

      return sheetInfo ? just({ id: sheetInfo.sheetId, range: sheetInfo.range }) : none();
    };
  },
});
