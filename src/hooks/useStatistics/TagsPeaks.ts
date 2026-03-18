import _ from "lodash";
import { LogEntry } from "../useLogs";
import { CategorizedTag } from "@/types/tagCategories";

export interface TagsPeakData {
  tags: (CategorizedTag & {
    items: LogEntry[];
  })[]
}

const MIN_PEAKS = 3;

export const getTagsPeaksData = (items: LogEntry[], settingsTags: CategorizedTag[]): TagsPeakData => {
  const distribution = _.countBy(
    items.flatMap((item) => item.tags.map((tag) => tag.tagId))
  );

  const tags = Object.keys(distribution)
    .filter((key) => {
      const tag = settingsTags.find((tag) => tag.id === key);

      return (
        distribution[key] >= MIN_PEAKS &&
        tag !== undefined &&
        !tag.isArchived
      )
    })
    .map((key) => ({
      ...settingsTags.find((tag) => tag.id === key)!,
      items: items.filter((item) => item.tags.find((tag) => tag.tagId === key)),
    }))
    .filter((tag) => tag && tag.items.length > 0)

  return {
    tags,
  };
};