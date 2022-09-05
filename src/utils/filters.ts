export const filterOutNulls = <T>(data: T | null): data is T => Boolean(data);
