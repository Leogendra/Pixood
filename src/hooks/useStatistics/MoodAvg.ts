import { LogEntry } from "../useLogs";
import { getLogDays } from '@/lib/utils';
import { NUMBER_OF_RATINGS } from '@/constants/Config';

export interface MoodAvgData {
  ratingHighestKey: 'negative' | 'neutral' | 'positive';
  ratingHighestPercentage: number;
  distribution: {
    key: number;
    count: number;
  }[];
  itemsCount: number;
}

export const defaultMoodAvgData: MoodAvgData = {
  ratingHighestKey: "neutral",
  ratingHighestPercentage: 0,
  itemsCount: 0,
  distribution: [],
}

export const getMoodAvgData = (items: LogEntry[]): MoodAvgData => {
  const moods = {
    negative: 0,
    neutral: 0,
    positive: 0,
  }

  const avgMoods = getLogDays(items)

  // Count mood categories based on numeric rating averages
  avgMoods.forEach((day) => {
    const avg = day.ratingAvg;
    
    if (avg <= 3) {
      moods.negative++
    } else if (avg >= 5) {
      moods.positive++
    } else {
      moods.neutral++
    }
  })

  const rating_total = moods.negative + moods.neutral + moods.positive;

  // Create distribution for each rating value (1 to NUMBER_OF_RATINGS)
  const rating_distribution = Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => {
    const ratingValue = i + 1;
    const count = items.reduce((acc, item) => {
      return acc + (item.rating?.filter(r => r === ratingValue).length || 0);
    }, 0);
    return {
      key: ratingValue,
      count,
    };
  });

  const ratings_total = rating_distribution.reduce(
    (acc, item) => acc + item.count,
    0
  );

  const ratingHighestKey = Object.keys(moods).reduce((a, b) =>
    moods[a] > moods[b] ? a : b
  ) as 'negative' | 'neutral' | 'positive';

  const percentage = rating_total > 0 ? Math.round(
    (moods[ratingHighestKey] / rating_total) * 100
  ) : 0;

  return {
    ratingHighestKey,
    ratingHighestPercentage: percentage,
    distribution: rating_distribution,
    itemsCount: ratings_total,
  };
};