import { constVoid } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';

type ChatsStorage = {
  getChat: () => IOO.IOOption<string>;
  rememberChat: (chatId: string) => IO.IO<void>;
};

const chatsStorage = new Map<string, string>();

export const connectToChatsStorage = (userId: string): ChatsStorage => ({
  getChat: () => IOO.fromNullable(chatsStorage.get(userId)),
  rememberChat: (chatId) => {
    chatsStorage.set(userId, chatId);
    return IO.of(constVoid());
  },
});
