import dayjs from "dayjs";
import { LogEntry } from "../useLogs";

type PeriodDataPoint = {
  date: Date;
  value: number;
}

export interface MoodTrendData {
  avgPeriod1: number;
  avgPeriod2: number;
  ratingsPeriode1: PeriodDataPoint[];
  ratingsPeriode2: PeriodDataPoint[];
  diff: number;
  status: 'improved' | 'declined';
  items: (LogEntry & { value: number })[]
}

export const defaultMoodTrendData: MoodTrendData = {
  avgPeriod1: 0,
  avgPeriod2: 0,
  ratingsPeriode1: [],
  ratingsPeriode2: [],
  diff: 0,
  status: 'improved',
  items: []
}

export const SCALE_TYPE = 'week';
export const SCALE_RANGE = 24;
const DEFAULT_WEEK_AVG = 4; // Middle of 1-7 scale

// Helper to calculate average rating from an array of ratings
const calculateAverage = (ratings: number[]): number => {
  if (ratings.length === 0) return DEFAULT_WEEK_AVG;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}

export const getMoodTrendData = (items: LogEntry[]): MoodTrendData => {
  const ratingsPeriode1: PeriodDataPoint[] = []
  const ratingsPeriode2: PeriodDataPoint[] = []

  for (let i = SCALE_RANGE / 2; i < SCALE_RANGE; i++) {
    const start = dayjs().subtract(i, SCALE_TYPE).startOf(SCALE_TYPE);
    const _items = items
      .filter((item) => {
        const itemDate = dayjs(item.dateTime);
        return itemDate.isSame(start, SCALE_TYPE)
      })
    
    // Collect all rating values from all entries in this week
    const allRatings = _items.flatMap(item => item.rating || []);
    const ratingAverage = allRatings.length > 0 
      ? Math.floor(calculateAverage(allRatings) * 100) / 100
      : DEFAULT_WEEK_AVG;
    
    ratingsPeriode1.push({
      date: start.toDate(),
      value: ratingAverage,
    });
  }

  for (let i = 0; i < SCALE_RANGE / 2; i++) {
    const start = dayjs().subtract(i, SCALE_TYPE).startOf(SCALE_TYPE);
    const _items = items
      .filter((item) => {
        const itemDate = dayjs(item.dateTime);
        return itemDate.isSame(start, SCALE_TYPE)
      })
    
    const allRatings = _items.flatMap(item => item.rating || []);
    const ratingAverage = allRatings.length > 0
      ? Math.floor(calculateAverage(allRatings) * 100) / 100
      : DEFAULT_WEEK_AVG;
    
    ratingsPeriode2.push({
      date: start.toDate(),
      value: ratingAverage,
    });
  }

  const avgPeriod1 = ratingsPeriode1.reduce((acc, item) => acc + item.value, 0) / ratingsPeriode1.length;
  const avgPeriod2 = ratingsPeriode2.reduce((acc, item) => acc + item.value, 0) / ratingsPeriode2.length;

  return {
    avgPeriod1,
    avgPeriod2,
    ratingsPeriode1,
    ratingsPeriode2,
    diff: Math.abs(avgPeriod1 - avgPeriod2),
    status: avgPeriod1 < avgPeriod2 ? 'improved' : 'declined',
    items: items.map(item => ({
      ...item,
      value: item.rating && item.rating.length > 0 
        ? calculateAverage(item.rating) 
        : DEFAULT_WEEK_AVG,
    }))
  }
}