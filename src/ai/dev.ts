import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-from-notes.ts';
import '@/ai/flows/generate-mock-exams.ts';
import '@/ai/flows/answer-cs-questions.ts';
import '@/ai/flows/create-flashcards-from-notes.ts';