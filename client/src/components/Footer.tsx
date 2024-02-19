import colorStore from "@/stores/colorStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Footer = () => {
  const heart = colorStore((state) => state.color) === "blue" ? "💙" : "❤️";
  return (
    <div className="pb-3 text-center font-medium text-muted-foreground">
      Made with {heart} by @
      <TooltipProvider delayDuration={150} skipDelayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="underline underline-offset-2">
              <a href="https://younes-chouikh.vercel.app/" target="_blank">
                Younes-ch
              </a>
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-background border-2 text-secondary-foreground">
            Check out my portfolio 🧑‍💻
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>{" "}
      | @
      <TooltipProvider delayDuration={150} skipDelayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="underline underline-offset-2">
              <a
                href="https://github.com/Younes-ch/issatso-schedule-scrapper/"
                target="_blank"
              >
                Github Repo
              </a>
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-background border-2 text-secondary-foreground">
            Give it a star ⭐
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Footer;
