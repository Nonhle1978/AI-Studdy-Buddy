🚀 AI Study Buddy

Your personal AI-powered learning assistant for Computer Science — built with Next.js, Gemini API, and Hugging Face.

The Study Buddy allows users to ask questions, upload or paste notes, and automatically generate flashcards, quizzes, and mock exams using advanced AI models.
No account or signup required — just click Get Started and learn.

✨ Features
🎯 Core Capabilities

AI Q&A Chatbot powered by Gemini

RAG (Retrieval-Augmented Generation) using Hugging Face embeddings

Paste notes directly into the app

Upload documents:

PDF

TXT

DOCX

Automatic note parsing & processing

Flashcard generator

Quiz generator

Mock exam generator

Works with no login / signup

📦 Additional Features

Clean and intuitive interface

Error-handling for uploads, file size, and unsupported formats

Real-time preview of uploaded note content

Scalable architecture designed for future growth

🧠 Technology Stack
Frontend

Next.js (App Router)

React

Tailwind CSS

ShadCN UI components

AI

Gemini API → reasoning, Q&A, quizzes, flashcards, mock exams

Hugging Face sentence-transformers → document embeddings

RAG Pipeline → semantic search + AI generation

File Parsing

pdf-parse or pdfjs-dist

mammoth for DOCX

Native parsing for TXT

Optional Backend

Firebase Storage (for saving files)

Firestore (for storing embeddings if persistent)

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/study-buddy.git
cd study-buddy

2️⃣ Install Dependencies
npm install

3️⃣ Add Environment Variables

Create a .env.local file:

GEMINI_API_KEY=your_key_here
HF_API_KEY=your_key_here

4️⃣ Run the Dev Server
npm run dev

🧩 How It Works
1. User Adds Notes

Users can either:

Paste text directly, OR

Upload a document (PDF, TXT, DOCX)

2. Content Processing

Uploaded documents are parsed into plaintext.
Both pasted text and uploaded content are:

cleaned

chunked

embedded with Hugging Face

stored in memory (or Firebase → optional)

3. User Asks a Question

The app:

embeds the question

retrieves relevant chunks (RAG)

sends context + question to Gemini

4. AI Generates Output

Gemini produces:

Explanations

Flashcards

Quizzes

Mock exams

All results are displayed in the UI instantly.
