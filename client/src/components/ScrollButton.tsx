import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ScrollButtonProps {
  icon: React.ReactNode;
  content: string;
  onClick: () => void;
}

const ScrollButton = ({ icon, content, onClick }: ScrollButtonProps) => {
  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="fixed bottom-16 right-16 rounded-full w-10 h-10 bg-primary flex justify-center items-center translate-y-[-25%] hover:animate-bounce hover:cursor-pointer"
            onClick={() => onClick()}
          >
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-seconday-foreground">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScrollButton;
