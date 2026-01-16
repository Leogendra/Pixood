export interface ChangelogEntry {
    slug: string;
    title: string;
    summary: string;
    published: string;
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
    {
        slug: '2.0.0-initial-release',
        title: 'Pixood 2.0.0 is here!',
        summary: 'The app is now fully offline, allowing you to view and manage your photos without an internet connection.',
        published: '2026',
    },
];
