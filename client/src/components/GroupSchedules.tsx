import { ArrowDown, ArrowUp } from "lucide-react";
import RemedialSchedule from "./RemedialSchedule";
import TimeTableSchedule from "./TimeTableSchedule";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import groupQueryStore from "@/stores/groupQueryStore";
import { useInViewport, useScrollIntoView } from "@mantine/hooks";

const GroupSchedules = () => {
  const selectedGroup = groupQueryStore((state) => state.selectedGroup);
  const { ref: remedialInViewportRef, inViewport: remedialInViewport } =
    useInViewport<HTMLDivElement>();
  const {
    scrollIntoView: remedialScrollIntoView,
    targetRef: remedialScrollIntoViewRef,
  } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const {
    scrollIntoView: timetableScrollIntoView,
    targetRef: timetableScrollIntoViewRef,
  } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  return (
    <>
      <TimeTableSchedule ref={timetableScrollIntoViewRef} />
      <div className="w-full flex justify-center" ref={remedialInViewportRef}>
        <RemedialSchedule ref={remedialScrollIntoViewRef} />
      </div>
      {selectedGroup && !remedialInViewport ? (
        <TooltipProvider delayDuration={150} skipDelayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="fixed bottom-16 right-16 rounded-full w-10 h-10 bg-primary flex justify-center items-center translate-y-[-25%] hover:animate-bounce hover:cursor-pointer"
                onClick={() => remedialScrollIntoView()}
              >
                <ArrowDown />
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-seconday-foreground">
              Scroll down to Remedial schedule
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : selectedGroup && remedialInViewport ? (
        <TooltipProvider delayDuration={150} skipDelayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="fixed bottom-16 right-16 rounded-full w-10 h-10 bg-primary flex justify-center items-center translate-y-[-25%] hover:animate-bounce hover:cursor-pointer"
                onClick={() => timetableScrollIntoView()}
              >
                <ArrowUp />
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-seconday-foreground">
              Scroll up to Timetable schedule
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </>
  );
};

export default GroupSchedules;
