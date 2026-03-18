import _ from "lodash";
import { LogEntry } from "../useLogs";
import { CategorizedTag } from "@/types/tagCategories";

export interface TagsDistributionData {
  tags: {
    id: string;
    details: CategorizedTag;
    count: number;
  }[];
}

export const defaultTagsDistributionData: TagsDistributionData = {
  tags: [],
}

export const dummyTagsDistributionData: TagsDistributionData = {
  tags: [
    {
      id: "1",
      details: {
        id: "1",
        categoryId: "c-1",
        title: "Tag 1",
        isArchived: false,
        createdAt: new Date().toISOString(),
      },
      count: 10,
    },
    {
      id: "2",
      details: {
        id: "2",
        categoryId: "c-1",
        title: "Tag 2",
        isArchived: false,
        createdAt: new Date().toISOString(),
      },
      count: 5,
    },
    {
      id: "3",
      details: {
        id: "3",
        categoryId: "c-2",
        title: "Tag 3",
        isArchived: false,
        createdAt: new Date().toISOString(),
      },
      count: 3,
    },
    {
      id: "4",
      details: {
        id: "4",
        categoryId: "c-2",
        title: "Tag 4",
        isArchived: false,
        createdAt: new Date().toISOString(),
      },
      count: 2,
    },
  ],
}

export const getTagsDistributionData = (items: LogEntry[], tags: CategorizedTag[]): TagsDistributionData => {
  const distribution = _.countBy(
    items.flatMap((item) => item?.tags?.map((tag) => tag?.tagId))
  );
  const _tags = Object.keys(distribution)
    .map((key) => ({
      details: tags.find((tag) => tag.id === key)!,
      id: key,
      count: distribution[key],
    }))
    .filter((tag) => tag.details !== undefined)
    .filter((tag) => !tag.details.isArchived)
    .sort((a, b) => b.count - a.count);

  return {
    tags: _tags,
  };
};
