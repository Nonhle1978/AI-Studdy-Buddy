import { LogoIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon className="h-6 w-6 text-primary" />
      <h1 className="font-headline text-xl font-semibold text-primary">
        StudyAI
      </h1>
    </div>
  );
}
