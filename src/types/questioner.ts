export type QuestionAnswerText = Record<string, string> | null;

export interface QuestionAnswer {
  id: string;
  emoji: string;
  text: QuestionAnswerText;
}

export interface QuestionDefinition {
  id: string;
  appVersion?: string;
  text: Record<string, string>;
  type: 'single' | 'multiple';
  answers: QuestionAnswer[];
}
