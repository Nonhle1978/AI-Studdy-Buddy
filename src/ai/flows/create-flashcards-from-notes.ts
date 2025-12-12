'use server';
/**
 * @fileOverview Creates flashcards from uploaded notes.
 *
 * - createFlashcardsFromNotes - A function that generates flashcards from user-provided notes.
 * - CreateFlashcardsFromNotesInput - The input type for the createFlashcardsFromNotes function.
 * - CreateFlashcardsFromNotesOutput - The return type for the createFlashcardsFromNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateFlashcardsFromNotesInputSchema = z.object({
  notes: z
    .string()
    .describe('The notes to generate flashcards from.'),
});
export type CreateFlashcardsFromNotesInput = z.infer<typeof CreateFlashcardsFromNotesInputSchema>;

const CreateFlashcardsFromNotesOutputSchema = z.object({
  flashcards: z.array(z.object({
    front: z.string().describe('The front of the flashcard.'),
    back: z.string().describe('The back of the flashcard.'),
  })).describe('The generated flashcards.'),
});
export type CreateFlashcardsFromNotesOutput = z.infer<typeof CreateFlashcardsFromNotesOutputSchema>;

export async function createFlashcardsFromNotes(input: CreateFlashcardsFromNotesInput): Promise<CreateFlashcardsFromNotesOutput> {
  return createFlashcardsFromNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createFlashcardsFromNotesPrompt',
  input: {schema: CreateFlashcardsFromNotesInputSchema},
  output: {schema: CreateFlashcardsFromNotesOutputSchema},
  prompt: `You are an expert at creating flashcards for students.

  Based on the notes provided, generate a list of flashcards that cover the key concepts.

  Notes: {{{notes}}}
  `,
});

const createFlashcardsFromNotesFlow = ai.defineFlow(
  {
    name: 'createFlashcardsFromNotesFlow',
    inputSchema: CreateFlashcardsFromNotesInputSchema,
    outputSchema: CreateFlashcardsFromNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
