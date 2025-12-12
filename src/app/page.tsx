import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Logo } from '@/components/logo';

export default function RootPage() {
  const features = [
    {
      id: 'feature-qa',
      title: 'AI Q&A Assistant',
      description: 'Get instant answers to your computer science questions.',
    },
    {
      id: 'feature-flashcards',
      title: 'Flashcard Generator',
      description: 'Create flashcards from your notes to study key concepts.',
    },
    {
      id: 'feature-quiz',
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with quizzes generated from any topic.',
    },
    {
      id: 'feature-exams',
      title: 'Mock Exams',
      description: 'Prepare for exams with mock tests covering various question types.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center">
        <Logo />
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 font-headline">
            Your AI Study Buddy
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Learn computer science faster with intelligent Q&A, quizzes, flashcards, and mock exams.
          </p>
          <Button asChild size="lg">
            <Link href="/assistant">Get Started</Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16">
          {features.map((feature) => {
            const image = PlaceHolderImages.find((img) => img.id === feature.id);
            return (
              <Card key={feature.id}>
                {image && (
                  <CardContent className="p-0">
                    <Image
                      src={image.imageUrl}
                      alt={feature.title}
                      width={600}
                      height={400}
                      className="rounded-t-lg aspect-[3/2] object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  </CardContent>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Built with AI, for learning.</p>
      </footer>
    </div>
  );
}
