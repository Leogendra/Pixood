import { LogItem } from '@/hooks/useLogs';
import { CategorizedTag, TagCategory } from '@/types/tagCategories';
import { LogEntry, LogExportData, RATING_TO_SCORE_MAPPING, CategorizedTagEntry } from '@/types/logFormat';
import { Tag } from '@/hooks/useTags';
import { EMOTIONS } from '@/components/Logger/config';

/**
 * Convertit un LogItem ancien format vers le nouveau format LogEntry
 */
export function convertLogItemToLogEntry(
  logItem: LogItem,
  categories: TagCategory[],
  categorizedTags: CategorizedTag[],
  oldTags?: Tag[]
): LogEntry {
  // Conversion de la date au format YYYY-M-D
  const dateStr = logItem.date.replace(/-0(\d)/g, '-$1'); // Supprime les zéros initiaux
  
  // Conversion du rating en score
  const score = RATING_TO_SCORE_MAPPING[logItem.rating];
  
  // Organisation des tags par catégories
  const tagsByCategory: CategorizedTagEntry[] = [];
  
  // Traiter les émotions (ancien système)
  if (logItem.emotions && logItem.emotions.length > 0) {
    const emotionLabels = logItem.emotions
      .map(emotionKey => {
        const emotion = EMOTIONS.find(e => e.key === emotionKey);
        return emotion ? emotion.label : null;
      })
      .filter(Boolean) as string[];
    
    if (emotionLabels.length > 0) {
      tagsByCategory.push({
        type: 'Emotions',
        entries: emotionLabels,
      });
    }
  }
  
  // Traiter les tags par références (ancien système)
  if (logItem.tags && logItem.tags.length > 0) {
    const tagNames = logItem.tags
      .map(tagRef => {
        const tag = oldTags?.find(t => t.id === tagRef.id);
        return tag ? tag.title : null;
      })
      .filter(Boolean) as string[];
    
    if (tagNames.length > 0) {
      tagsByCategory.push({
        type: 'Activities', // Catégorie par défaut pour les anciens tags
        entries: tagNames,
      });
    }
  }
  
  // Traiter les tags du nouveau système categorisé
  // TODO: Implémenter quand le nouveau système sera actif dans les logs
  
  return {
    date: dateStr,
    type: 'Mood',
    scores: [score],
    notes: logItem.message || '',
    tags: tagsByCategory,
  };
}

/**
 * Convertit un LogEntry vers LogItem (pour rétrocompatibilité)
 */
export function convertLogEntryToLogItem(
  logEntry: LogEntry,
  categories: TagCategory[],
  categorizedTags: CategorizedTag[]
): Partial<LogItem> {
  // Conversion de la date au format YYYY-MM-DD
  const dateParts = logEntry.date.split('-');
  const dateStr = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
  
  // Conversion du score en rating
  const score = logEntry.scores[0] || 3; // Default neutral
  const ratingEntries = Object.entries(RATING_TO_SCORE_MAPPING);
  const ratingEntry = ratingEntries.find(([, value]) => value === score);
  const rating = ratingEntry ? ratingEntry[0] as LogItem['rating'] : 'neutral';
  
  // Extraction des émotions
  const emotionsCategory = logEntry.tags.find(cat => cat.type === 'Emotions');
  const emotions: string[] = [];
  
  if (emotionsCategory) {
    emotionsCategory.entries.forEach(emotionLabel => {
      const emotion = EMOTIONS.find(e => e.label === emotionLabel);
      if (emotion) {
        emotions.push(emotion.key);
      }
    });
  }
  
  // TODO: Gérer la conversion des tags categorisés vers l'ancien format TagReference[]
  const tags: LogItem['tags'] = [];
  
  return {
    date: dateStr,
    rating,
    message: logEntry.notes,
    emotions,
    tags,
    // Les autres champs (id, dateTime, createdAt, sleep) doivent être gérés par l'appelant
  };
}

/**
 * Convertit une liste de LogItems vers le format d'export LogExportData
 */
export function convertLogItemsToExportData(
  logItems: LogItem[],
  categories: TagCategory[],
  categorizedTags: CategorizedTag[],
  oldTags?: Tag[]
): LogExportData {
  return logItems.map(item => convertLogItemToLogEntry(item, categories, categorizedTags, oldTags));
}

/**
 * Organisent les tags par catégorie pour le nouveau format
 */
export function organizeTagsByCategory(
  selectedTagIds: string[],
  categories: TagCategory[],
  categorizedTags: CategorizedTag[]
): CategorizedTagEntry[] {
  const result: CategorizedTagEntry[] = [];
  
  categories.forEach(category => {
    const categoryTags = categorizedTags
      .filter(tag => tag.categoryId === category.id && selectedTagIds.includes(tag.id))
      .map(tag => tag.title);
    
    if (categoryTags.length > 0) {
      result.push({
        type: category.name,
        entries: categoryTags,
      });
    }
  });
  
  return result;
}