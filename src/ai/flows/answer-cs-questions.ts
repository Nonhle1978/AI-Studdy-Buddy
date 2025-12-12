'use server';

/**
 * @fileOverview This flow answers computer science questions using the Gemini API.
 *
 * - answerCsQuestions - A function that takes a question string and returns an answer string.
 * - AnswerCsQuestionsInput - The input type for the answerCsQuestions function.
 * - AnswerCsQuestionsOutput - The return type for the answerCsQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerCsQuestionsInputSchema = z.object({
  question: z.string().describe('The computer science question to answer.'),
});
export type AnswerCsQuestionsInput = z.infer<typeof AnswerCsQuestionsInputSchema>;

const AnswerCsQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the computer science question.'),
});
export type AnswerCsQuestionsOutput = z.infer<typeof AnswerCsQuestionsOutputSchema>;

export async function answerCsQuestions(input: AnswerCsQuestionsInput): Promise<AnswerCsQuestionsOutput> {
  return answerCsQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerCsQuestionsPrompt',
  input: {schema: AnswerCsQuestionsInputSchema},
  output: {schema: AnswerCsQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant with expertise in computer science. Answer the following question:

{{question}}`,
});

const answerCsQuestionsFlow = ai.defineFlow(
  {
    name: 'answerCsQuestionsFlow',
    inputSchema: AnswerCsQuestionsInputSchema,
    outputSchema: AnswerCsQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
