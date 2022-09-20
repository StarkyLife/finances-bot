import { fromNullable, Maybe } from '@sweet-monads/maybe';

type ChatsStorage = {
  getChat: () => Maybe<string>;
  rememberChat: (chatId: string) => void;
};

const chatsStorage = new Map<string, string>();

export const connectToChatsStorage = (userId: string): ChatsStorage => ({
  getChat: () => fromNullable(chatsStorage.get(userId)),
  rememberChat: (chatId) => {
    chatsStorage.set(userId, chatId);
  },
});
