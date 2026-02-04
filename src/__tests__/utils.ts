import { LogEntry } from "@/types/logFormat";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";


export const _generateItem = (item: Partial<LogEntry>): LogEntry => {
  const date = item.date || dayjs().format('YYYY-MM-DD');
  const newItem: LogEntry = {
    id: uuidv4(),
    date,
    rating: [3],
    notes: '🥹',
    dateTime: new Date().toISOString(),
    metrics: {},
    tags: [],
    ...item
  };

  return newItem;
};
