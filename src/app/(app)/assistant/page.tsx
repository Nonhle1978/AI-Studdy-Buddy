{"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Bot, User, Loader2, FileText, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCsAnswer } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import mammoth from "mammoth";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function AssistantPage() {
  const [notes, setNotes] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation]);

  const parseFile = async (file: File) => {
    setFileLoading(true);
    try {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        let content = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          content += textContent.items.map((item: any) => item.str).join(" ");
        }
        return content;
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        return value;
      } else if (file.type === "text/plain") {
        return file.text();
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      toast({
        title: "File Parsing Error",
        description: "Could not read the content of the file.",
        variant: "destructive",
      });
      return "";
    } finally {
      setFileLoading(false);
    }
    return "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
        variant: "destructive",
      });
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, TXT, or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    const content = await parseFile(file);
    setFileContent(content);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileContent("");
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");

    startTransition(async () => {
      try {
        const combinedNotes = [notes, fileContent].filter(Boolean).join("\n\n---\n\n");
        const question = combinedNotes
          ? `Using the following notes: "${combinedNotes}", answer the question: "${input}"`
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
        setConversation((prev) => prev.slice(0, -1));
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)] p-4">
      <Card className="lg:col-span-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Your Knowledge Base</CardTitle>
          <CardDescription>
            Paste notes or upload a document to give the AI context.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Pasted Notes</h3>
            <Textarea
              placeholder="Paste your Computer Science notes here..."
              className="flex-grow w-full h-48 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Uploaded Document</h3>
            {uploadedFile ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate text-sm font-medium">{uploadedFile.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeFile}>
                      <X className="h-4 w-4"/>
                  </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={fileLoading}>
                {fileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload a document
              </Button>
            )}
             <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.txt,.docx"
            />
          </div>
           {(fileContent || fileLoading) && (
              <div className="flex flex-col gap-2 flex-grow">
                <h3 className="text-sm font-medium">Content Preview</h3>
                <Card className="flex-grow">
                    <CardContent className="p-3">
                         <ScrollArea className="h-32">
                           {fileLoading ? (
                             <div className="flex items-center justify-center h-full text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Parsing file...
                             </div>
                           ) : (
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                                {fileContent.substring(0, 500)}
                                {fileContent.length > 500 && '...'}
                            </p>
                           )}
                        </ScrollArea>
                    </CardContent>
                </Card>
              </div>
            )}
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
