export type User = {
  id: string;
  sheetInfos: Array<{
    sequenceId: string;
    sheetId: string;
    range: string;
  }>;
};
