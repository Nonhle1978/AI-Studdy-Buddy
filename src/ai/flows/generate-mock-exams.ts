'use server';

/**
 * @fileOverview A mock exam generation AI agent.
 *
 * - generateMockExam - A function that handles the mock exam generation process.
 * - GenerateMockExamInput - The input type for the generateMockExam function.
 * - GenerateMockExamOutput - The return type for the generateMockExam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMockExamInputSchema = z.object({
  topic: z.string().describe('The topic for the mock exam.'),
  notes: z.string().optional().describe('Optional notes to use for generating the mock exam.'),
  numQuestions: z.number().int().min(1).max(100).default(10).describe('The number of questions to generate for the mock exam.'),
  questionTypes: z.array(z.enum(['multiple-choice', 'short-answer', 'coding'])).optional().describe('The types of questions to include in the mock exam. If not specified, all types will be included.'),
});
export type GenerateMockExamInput = z.infer<typeof GenerateMockExamInputSchema>;

const GenerateMockExamOutputSchema = z.object({
  exam: z.string().describe('The generated mock exam in a readable format.'),
});
export type GenerateMockExamOutput = z.infer<typeof GenerateMockExamOutputSchema>;

export async function generateMockExam(input: GenerateMockExamInput): Promise<GenerateMockExamOutput> {
  return generateMockExamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMockExamPrompt',
  input: {schema: GenerateMockExamInputSchema},
  output: {schema: GenerateMockExamOutputSchema},
  prompt: `You are an AI assistant designed to generate mock exams for computer science students.

  Your task is to create a mock exam on the topic: {{{topic}}}.

  The exam should consist of {{{numQuestions}}} questions.

  Include the following types of questions: {{#if questionTypes}}{{{questionTypes}}}{{else}}multiple-choice, short-answer, and coding{{/if}}.

  {{#if notes}}
  Use the following notes as a reference:
  {{{notes}}}
  {{else}}
  If no notes are provided, use your general knowledge of computer science to generate the exam.
  {{/if}}

  The output should be a well-formatted exam with clear questions and, where applicable, answer choices or instructions.
`,
});

const generateMockExamFlow = ai.defineFlow(
  {
    name: 'generateMockExamFlow',
    inputSchema: GenerateMockExamInputSchema,
    outputSchema: GenerateMockExamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
