import { useState } from 'react';

export const THINKING_DELAY = 0;
export const ANSWER_DELAY = 0;
export const SHOW_ANSWERS_DELAY = 0;

export interface BotAnswer {
  type: 'button_primary' | 'button_secondary' | 'rating' | 'emotions' | 'text' | 'sleep_quality';
  buttonText?: string;
  messageText?: string | ((data: any) => string);
  action?: (options?: any) => void;
}

export interface BotQuestion {
  id: string;
  text: string;
  answers: BotAnswer[];
}

// Stubbed bot questions; feedback/analytics removed
export const useBotQuestions = () => {
  return useState<BotQuestion[]>([]);
};
