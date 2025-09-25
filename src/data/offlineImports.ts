import { ImportData } from '@/helpers/Import';
import { INITIAL_STATE } from '@/hooks/useSettings';

export interface OfflineImportUser {
  id: string;
  importData: ImportData;
}

const baseSettings = {
  scaleType: INITIAL_STATE.scaleType,
  reminderEnabled: INITIAL_STATE.reminderEnabled,
  reminderTime: INITIAL_STATE.reminderTime,
  analyticsEnabled: false,
  actionsDone: [],
  steps: INITIAL_STATE.steps,
};

export const OFFLINE_IMPORT_USERS: OfflineImportUser[] = [
  {
    id: 'demo-user',
    importData: {
      version: '1.0.0',
      items: [
        {
          id: 'demo-log-1',
          message: 'Demo log entry',
          date: '2024-05-01',
          dateTime: '2024-05-01T12:00:00.000Z',
          createdAt: '2024-05-01T12:00:00.000Z',
          rating: 'good',
          tags: [],
          emotions: [],
          sleep: {
            quality: 'good',
          },
        },
        {
          id: 'demo-log-2',
          message: 'Another demo log',
          date: '2024-05-02',
          dateTime: '2024-05-02T12:00:00.000Z',
          createdAt: '2024-05-02T12:00:00.000Z',
          rating: 'very_good',
          tags: [],
          emotions: [],
          sleep: {
            quality: 'very_good',
          },
        },
      ],
      tags: [],
      settings: {
        ...baseSettings,
      },
    },
  },
  {
    id: 'sample-sleep-tracker',
    importData: {
      version: '1.0.0',
      items: [
        {
          id: 'sleep-log-1',
          message: 'Sleep tracking demo',
          date: '2024-04-28',
          dateTime: '2024-04-28T21:00:00.000Z',
          createdAt: '2024-04-28T21:00:00.000Z',
          rating: 'neutral',
          tags: [],
          emotions: [],
          sleep: {
            quality: 'neutral',
          },
        },
      ],
      tags: [],
      settings: {
        ...baseSettings,
        reminderEnabled: true,
        reminderTime: '21:00',
      },
    },
  },
];
