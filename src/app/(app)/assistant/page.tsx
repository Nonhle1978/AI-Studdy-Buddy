"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Bot, User, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCsAnswer } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPage() {
  const [notes, setNotes] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");

    startTransition(async () => {
      try {
        const question = notes
          ? `Using the following notes: "${notes}", answer the question: "${input}"`
          : input;
        
        const result = await getCsAnswer({ question });

        const assistantMessage: Message = {
          role: "assistant",
          content: result.answer,
        };
        setConversation((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error getting answer:", error);
        toast({
          title: "Error",
          description: "Failed to get an answer from the assistant. Please try again.",
          variant: "destructive",
        });
        setConversation((prev) => prev.slice(0, -1)); // Remove the user message on error
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)] p-4">
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Your Notes</CardTitle>
          <CardDescription>
            Add your notes here to give the AI context for your questions (RAG).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <Textarea
            placeholder="Paste your Computer Science notes here..."
            className="flex-grow w-full h-full resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 flex flex-col h-full">
        <CardHeader>
          <CardTitle className="font-headline">AI Assistant</CardTitle>
          <CardDescription>Ask me anything about Computer Science!</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2.5 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-xl px-4 py-2.5 text-sm flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending || !input.trim()}>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
