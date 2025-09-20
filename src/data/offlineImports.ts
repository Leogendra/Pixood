import { ImportData } from '@/helpers/Import';
import { INITIAL_STATE } from '@/hooks/useSettings';

export interface OfflineImportUser {
  id: string;
  importData: ImportData;
}

const baseSettings = {
  passcodeEnabled: INITIAL_STATE.passcodeEnabled,
  passcode: INITIAL_STATE.passcode,
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
          date: '2024-05-01',
          rating: 'good',
          tags: [],
        },
        {
          id: 'demo-log-2',
          date: '2024-05-02',
          rating: 'very_good',
          tags: [],
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
          date: '2024-04-28',
          rating: 'neutral',
          tags: [],
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
