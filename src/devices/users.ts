import { GetSheetInfo } from '../use-cases/dependencies/google-sheet';
import { User } from './data/user';

type UserGateway = {
  authorize: (userId: string) => void;
  createSheetInfoGetter: (userId: string) => GetSheetInfo;
};

export const createUserGateway = (users: User[]): UserGateway => ({
  authorize: (userId) => {
    if (!users.some((u) => u.id === userId)) throw new Error('Authorization failed!');
  },
  createSheetInfoGetter: (userId) => {
    const user = users.find((u) => u.id === userId);

    return (sequenceId) => {
      const sheetInfo = user?.sheetInfos.find((i) => i.sequenceId === sequenceId);

      return sheetInfo ? { id: sheetInfo.sheetId, range: sheetInfo.range } : undefined;
    };
  },
});
