import _ from "lodash";
import { LogEntry } from "@/types/logFormat";
import { ImportData } from "./Import";

interface MigratedData extends ImportData {
  items: LogEntry[];
}

export const migrateImportData = (data: ImportData): MigratedData => {
  let { items, settings, tags, version } = data;

  let newItems = _.clone(items);

  if (!_.isArray(newItems)) {
    newItems = _.values(newItems);
  }

  newItems = newItems.map((item) => {
    const newItem = { ...item };

    if (!item?.tags) {
      newItem.tags = [];
    }

    return newItem;
  });

  let _tags = (tags || []).map((tag) => {
    if (tag.color === "stone") {
      tag.color = "slate";
    }
    return tag;
  });

  let _settings = _.omit(settings, 'tags');

  if (!_settings.actionsDone) _settings.actionsDone = [];

  return {
    version: version || "1.0.0",
    items: newItems,
    settings: _settings,
    tags: _tags
  };
};