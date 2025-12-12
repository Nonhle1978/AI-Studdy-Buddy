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
import { generateExam } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";

const examFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  numQuestions: z.coerce.number().int().min(1, "Must have at least 1 question.").max(50, "Cannot exceed 50 questions."),
  notes: z.string().optional(),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

const questionTypes = [
  { id: "multiple-choice", label: "Multiple Choice" },
  { id: "short-answer", label: "Short Answer" },
  { id: "coding", label: "Coding" },
];

export default function ExamsPage() {
  const [generatedExam, setGeneratedExam] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      topic: "Web Development",
      numQuestions: 10,
      notes: "",
      questionTypes: ["multiple-choice", "short-answer", "coding"],
    },
  });

  const onSubmit = (values: ExamFormValues) => {
    startTransition(async () => {
      try {
        const result = await generateExam(values);
        setGeneratedExam(result.exam);
      } catch (error) {
        console.error("Error generating exam:", error);
        toast({
          title: "Error",
          description: "Failed to generate exam. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Mock Exam Generator</h1>
        <p className="text-muted-foreground">
          Dynamically generate mock exams based on your chosen topics and notes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Exam Settings</CardTitle>
            <CardDescription>Configure your mock exam here.</CardDescription>
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
                        <Input placeholder="e.g., Databases" {...field} />
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
                  name="questionTypes"
                  render={() => (
                    <FormItem>
                       <FormLabel>Question Types</FormLabel>
                       <div className="space-y-2">
                        {questionTypes.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="questionTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
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
                          placeholder="Provide notes for a more customized exam..."
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
                      Generating Exam...
                    </>
                  ) : (
                    "Generate Exam"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generated Exam</CardTitle>
            <CardDescription>Your exam will appear below. Challenge yourself!</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : generatedExam ? (
              <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted rounded-lg whitespace-pre-wrap font-code">
                {generatedExam}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Your exam will be generated here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
