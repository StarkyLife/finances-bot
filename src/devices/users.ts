import { SheetInfo } from '../core/data/sheet';
import { User } from './data/user';

export const createUserGateway = (users: User[]) => ({
  authorize: (userId: string) => {
    if (!users.some((u) => u.id === userId)) throw new Error('Authorization failed!');
  },
  createSheetInfoGetter: (userId: string) => {
    const user = users.find((u) => u.id === userId);

    return (sequenceId: string): SheetInfo | undefined => {
      const sheetInfo = user?.sheetInfos.find((i) => i.sequenceId === sequenceId);

      return sheetInfo ? { id: sheetInfo.sheetId, range: sheetInfo.range } : undefined;
    };
  },
});
