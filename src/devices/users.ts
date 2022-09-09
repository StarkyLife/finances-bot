import { SheetInfo } from '../core/data/sheet';
import { User } from './data/user';

export const createUserGateway = ({ id, sheetInfos }: User) => ({
  authorize: (userId: string) => {
    if (userId !== id) throw new Error('Authorization failed!');

    return {
      getSheetInfo: (sequenceId: string): SheetInfo | undefined => {
        const sheetInfo = sheetInfos.find((i) => i.sequenceId === sequenceId);

        return sheetInfo ? { id: sheetInfo.sheetId, range: sheetInfo.range } : undefined;
      },
    };
  },
});
