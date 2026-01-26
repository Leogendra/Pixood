import { getLogDays } from "@/lib/utils";
import { LogDay, LogEntry } from "../useLogs";

export interface MoodPeaksPositiveData {
  days: LogDay[];
}

export interface MoodPeaksNegativeData {
  days: LogDay[];
}

export const defaultMoodPeaksPositiveData = {
  days: [],
};

export const defaultMoodPeaksNegativeData = {
  days: [],
};

export const getMoodPeaksPositiveData = (items: LogEntry[]): MoodPeaksPositiveData => {
  const logDays = getLogDays(items);
  // Consider days with average mood >=5 as positive peaks
  const positiveDaysPeaked = logDays.filter((item) => item.ratingAvg >= 5);

  return {
    days: positiveDaysPeaked,
  };
};

export const getMoodPeaksNegativeData = (items: LogEntry[]): MoodPeaksNegativeData => {
  const logDays = getLogDays(items);
  // Consider days with average mood <=3 as negative peaks
  const negativeItemsPeaked = logDays.filter((item) => item.ratingAvg <= 3);

  return {
    days: negativeItemsPeaked,
  };
};