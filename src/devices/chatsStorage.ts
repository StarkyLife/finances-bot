import * as O from 'fp-ts/Option';

type ChatsStorage = {
  getChat: () => O.Option<string>;
  rememberChat: (chatId: string) => void;
};

const chatsStorage = new Map<string, string>();

export const connectToChatsStorage = (userId: string): ChatsStorage => ({
  getChat: () => O.fromNullable(chatsStorage.get(userId)),
  rememberChat: (chatId) => {
    chatsStorage.set(userId, chatId);
  },
});
