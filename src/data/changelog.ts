export interface ChangelogEntry {
  slug: string;
  title: string;
  summary: string;
  published: string;
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    slug: 'offline-mode-initial-release',
    title: 'Offline mode is here',
    summary: 'Pixy no longer requires an internet connection. Feedback, surveys and statistics are stored securely on your device.',
    published: '2024-05-01',
  },
  {
    slug: 'offline-quality-of-life',
    title: 'Quality of life improvements',
    summary: 'Improved local backups, refined reminders and better performance when managing large journals.',
    published: '2024-04-10',
  },
];
