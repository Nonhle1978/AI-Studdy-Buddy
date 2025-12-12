"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createFlashcards } from "@/app/actions";
import { Flashcard } from "./flashcard";

type FlashcardData = {
  front: string;
  back: string;
};

export default function FlashcardsPage() {
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!notes.trim()) {
      toast({
        title: "Notes are empty",
        description: "Please enter some notes to generate flashcards from.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await createFlashcards({ notes });
        if (result.flashcards.length === 0) {
          toast({
            title: "No Flashcards Generated",
            description: "We couldn't generate any flashcards from your notes. Try providing more detailed notes.",
          });
        }
        setFlashcards(result.flashcards);
      } catch (error) {
        console.error("Error creating flashcards:", error);
        toast({
          title: "Error",
          description: "Failed to create flashcards. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Flashcard Generator</h1>
        <p className="text-muted-foreground">
          Create flashcards automatically from your notes or key concepts.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Notes</CardTitle>
            <CardDescription>Paste your notes below to generate flashcards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., An algorithm is a step-by-step procedure for calculations. Data structures are a way of organizing and storing data..."
              className="h-64 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isPending}
            />
            <Button onClick={handleGenerate} disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Flashcards"
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {flashcards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map((card, index) => (
                <Flashcard key={index} front={card.front} back={card.back} />
              ))}
            </div>
          ) : (
            <Card className="flex items-center justify-center h-full min-h-[300px] border-dashed">
              <div className="text-center text-muted-foreground">
                <p>Your generated flashcards will appear here.</p>
                <p className="text-sm">
                  {isPending ? "The AI is working its magic..." : "Enter some notes and click generate!"}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
