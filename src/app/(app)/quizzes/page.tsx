"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateQuiz } from "@/app/actions";

const quizFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  numQuestions: z.coerce.number().int().min(1, "Must have at least 1 question.").max(20, "Cannot exceed 20 questions."),
  notes: z.string(),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export default function QuizzesPage() {
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      topic: "Data Structures",
      numQuestions: 5,
      notes: "",
    },
  });

  const onSubmit = (values: QuizFormValues) => {
    startTransition(async () => {
      try {
        const result = await generateQuiz(values);
        setGeneratedQuiz(result.quiz);
      } catch (error) {
        console.error("Error generating quiz:", error);
        toast({
          title: "Error",
          description: "Failed to generate quiz. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Quiz Generator</h1>
        <p className="text-muted-foreground">
          Generate quizzes based on your notes or general Computer Science knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
            <CardDescription>Configure your quiz here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Algorithms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide notes for a more customized quiz..."
                          className="h-40 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    "Generate Quiz"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generated Quiz</CardTitle>
            <CardDescription>Your quiz will appear below. Good luck!</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : generatedQuiz ? (
              <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted rounded-lg whitespace-pre-wrap font-code">
                {generatedQuiz}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Your quiz will be generated here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
