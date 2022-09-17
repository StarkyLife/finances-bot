type ChatsStorage = {
  getChat: () => string | undefined;
  rememberChat: (chatId: string) => void;
};

const chatsStorage = new Map<string, string>();

export const connectToChatsStorage = (userId: string): ChatsStorage => ({
  getChat: () => chatsStorage.get(userId),
  rememberChat: (chatId) => {
    chatsStorage.set(userId, chatId);
  },
});
