"use server";

import {
  answerCsQuestions,
  AnswerCsQuestionsInput,
  AnswerCsQuestionsOutput,
} from "@/ai/flows/answer-cs-questions";
import {
  createFlashcardsFromNotes,
  CreateFlashcardsFromNotesInput,
  CreateFlashcardsFromNotesOutput,
} from "@/ai/flows/create-flashcards-from-notes";
import {
  generateMockExam,
  GenerateMockExamInput,
  GenerateMockExamOutput,
} from "@/ai/flows/generate-mock-exams";
import {
  generateQuizFromNotes,
  GenerateQuizFromNotesInput,
  GenerateQuizFromNotesOutput,
} from "@/ai/flows/generate-quiz-from-notes";

export async function getCsAnswer(
  input: AnswerCsQuestionsInput
): Promise<AnswerCsQuestionsOutput> {
  return await answerCsQuestions(input);
}

export async function createFlashcards(
  input: CreateFlashcardsFromNotesInput
): Promise<CreateFlashcardsFromNotesOutput> {
  return await createFlashcardsFromNotes(input);
}

export async function generateQuiz(
  input: GenerateQuizFromNotesInput
): Promise<GenerateQuizFromNotesOutput> {
  return await generateQuizFromNotes(input);
}

export async function generateExam(
  input: GenerateMockExamInput
): Promise<GenerateMockExamOutput> {
  return await generateMockExam(input);
}
