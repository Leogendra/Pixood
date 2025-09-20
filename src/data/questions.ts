import { QuestionDefinition } from '@/types/questioner';

export const OFFLINE_QUESTION_BANK: QuestionDefinition[] = [
  {
    id: 'offline-mode-feedback',
    appVersion: '>=0.0.0',
    text: {
      en: 'How is the offline mode working for you?',
      de: 'Wie funktioniert der Offlinemodus für dich?',
      fr: 'Comment fonctionne le mode hors ligne pour vous ?'
    },
    type: 'single',
    answers: [
      {
        id: 'offline-mode-feedback-great',
        emoji: '👍',
        text: {
          en: 'Everything works great',
          de: 'Alles funktioniert super',
          fr: 'Tout fonctionne très bien'
        }
      },
      {
        id: 'offline-mode-feedback-issues',
        emoji: '🛠️',
        text: {
          en: 'I noticed an issue',
          de: 'Ich habe ein Problem bemerkt',
          fr: 'J’ai remarqué un problème'
        }
      },
      {
        id: 'offline-mode-feedback-later',
        emoji: '⏱️',
        text: {
          en: 'Ask me again later',
          de: 'Frag mich später nochmal',
          fr: 'Redemandez-moi plus tard'
        }
      }
    ]
  },
  {
    id: 'offline-reflection',
    appVersion: '>=0.0.0',
    text: {
      en: 'What helps you stay grounded when you are offline?',
      de: 'Was hilft dir, offline zur Ruhe zu kommen?',
      fr: 'Qu’est-ce qui vous aide à rester ancré hors ligne ?'
    },
    type: 'multiple',
    answers: [
      {
        id: 'offline-reflection-music',
        emoji: '🎧',
        text: {
          en: 'Listening to music',
          de: 'Musik hören',
          fr: 'Écouter de la musique'
        }
      },
      {
        id: 'offline-reflection-writing',
        emoji: '📝',
        text: {
          en: 'Writing down my thoughts',
          de: 'Meine Gedanken aufschreiben',
          fr: 'Écrire mes pensées'
        }
      },
      {
        id: 'offline-reflection-move',
        emoji: '🚶',
        text: {
          en: 'Moving my body',
          de: 'Mich bewegen',
          fr: 'Bouger mon corps'
        }
      },
      {
        id: 'offline-reflection-other',
        emoji: '✨',
        text: null
      }
    ]
  }
];
