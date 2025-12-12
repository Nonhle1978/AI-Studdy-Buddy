# **App Name**: StudyAI

## Core Features:

- AI Q&A Assistant: Answer user questions on Computer Science fundamentals using the Gemini API; fallback to general CS knowledge when no notes are uploaded.
- RAG Chatbot: Enable users to upload notes (PDFs, text) to expand the knowledge base; AI references these notes to answer questions accurately, acting as a tool to help recall the information within the documents.
- Interactive Quizzes: Generate quizzes based on uploaded notes or general CS knowledge; includes multiple-choice, short answer, and coding questions.
- Flashcard Generator: Create flashcards automatically from uploaded notes or key CS concepts.
- Mock Exams: Dynamically generate mock exams based on chosen topics/notes, mirroring real exam formats.
- Secure User Accounts: Allow users to sign up and log in to securely save notes, quizzes, flashcards, and mock exams; data is user-specific and separated.
- Data Persistence: Store user notes, flashcards, quiz history, and mock exams securely in Firebase Firestore.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) for intelligence and focus.
- Background color: Light purple (#EDE7F6) for a calming, study-friendly ambiance.
- Accent color: Teal (#009688) to highlight key features and CTAs.
- Body text: 'Inter', a grotesque-style sans-serif, for its modern and neutral look that supports readability. Headline font: 'Space Grotesk', a proportional sans-serif, creating contrast with the body text and setting a slightly computerized tone that fits the content.
- Code snippets: 'Source Code Pro' for clear and monospaced presentation.
- Use clear, academic-themed icons.
- Subtle, educational animations during quiz loading and concept explanations.