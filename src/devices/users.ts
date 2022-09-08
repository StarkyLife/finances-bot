import { SheetInfo } from '../core/data/sheet';
import { User } from './data/user';

export const createUserGateway = ({ id, sheetId, range }: User) => ({
  authorize: (userId: string) => {
    if (userId !== id) throw new Error('Authorization failed!');

    return {
      getSheetInfo: (): SheetInfo | undefined => (sheetId ? { id: sheetId, range } : undefined),
    };
  },
});
