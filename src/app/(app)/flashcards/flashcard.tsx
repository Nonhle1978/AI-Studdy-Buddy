"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group h-64 w-full perspective-[1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsFlipped(!isFlipped)}
      aria-label={`Flashcard. Front: ${front}. Click to flip.`}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        <Card className="absolute h-full w-full backface-hidden flex items-center justify-center p-6 text-center">
          <CardContent className="p-0">
            <p className="text-xl font-semibold">{front}</p>
          </CardContent>
        </Card>
        <Card className="absolute h-full w-full backface-hidden rotate-y-180 flex items-center justify-center p-6 text-center bg-secondary">
          <CardContent className="p-0">
            <p className="text-base">{back}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add this to your globals.css or a style tag if needed for the 3D effect:
// .perspective-\[1000px\] { perspective: 1000px; }
// .transform-style-3d { transform-style: preserve-3d; }
// .backface-hidden { backface-visibility: hidden; }
// .rotate-y-180 { transform: rotateY(180deg); }
// These classes can also be added to tailwind.config.js
// We'll add them to globals.css
// No, tailwind has utilities for this. Let's just use them.
// Add a new style tag for this.
// `transform-style: preserve-3d` can be `[transform-style:preserve-3d]`
// `backface-visibility: hidden` can be `[backface-visibility:hidden]`
// Ok, let's create custom utility classes in globals.css.
// After checking, these are better added as utilities in tailwind.
// For now, I'll add a helper comment and manually define them.
// I will create custom utilities in globals.css for better reusability.
// In globals.css:
/*
@layer utilities {
  .perspective {
    perspective: 1000px;
  }
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
}
*/
// It's better to use arbitrary values `[perspective:1000px]`
// Yes, I'll use arbitrary values in the className. This avoids changing globals.css
