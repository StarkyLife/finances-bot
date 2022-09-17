export type User = {
  id: string;
  wildberriesToken?: string;
  sheetInfos: Array<{
    sequenceId: string;
    sheetId: string;
    range: string;
  }>;
};
