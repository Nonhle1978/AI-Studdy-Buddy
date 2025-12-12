'use server';

/**
 * @fileOverview Generates a quiz from uploaded notes using AI.
 *
 * - generateQuizFromNotes - A function that generates a quiz from notes.
 * - GenerateQuizFromNotesInput - The input type for the generateQuizFromNotes function.
 * - GenerateQuizFromNotesOutput - The return type for the generateQuizFromNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromNotesInputSchema = z.object({
  notes: z.string().describe('The notes to generate the quiz from.'),
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizFromNotesInput = z.infer<typeof GenerateQuizFromNotesInputSchema>;

const GenerateQuizFromNotesOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz.'),
});
export type GenerateQuizFromNotesOutput = z.infer<typeof GenerateQuizFromNotesOutputSchema>;

export async function generateQuizFromNotes(input: GenerateQuizFromNotesInput): Promise<GenerateQuizFromNotesOutput> {
  return generateQuizFromNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromNotesPrompt',
  input: {schema: GenerateQuizFromNotesInputSchema},
  output: {schema: GenerateQuizFromNotesOutputSchema},
  prompt: `You are a quiz generator. You will generate a quiz based on the notes provided.

Notes: {{{notes}}}

Topic: {{{topic}}}

Number of Questions: {{{numQuestions}}}

Quiz:`,
});

const generateQuizFromNotesFlow = ai.defineFlow(
  {
    name: 'generateQuizFromNotesFlow',
    inputSchema: GenerateQuizFromNotesInputSchema,
    outputSchema: GenerateQuizFromNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
