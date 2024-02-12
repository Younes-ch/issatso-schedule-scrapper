import GroupSelector from "@/components/GroupSelector";
import RemedialSchedule from "@/components/RemedialSchedule";
import TimeTableSchedule from "@/components/TimeTableSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import colorStore from "@/stores/colorStore";
import cursorHideStore from "@/stores/cursorHideStore";
import groupQueryStore from "@/stores/groupQueryStore";
import { useInViewport, useScrollIntoView } from "@mantine/hooks";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect } from "react";

const Schedules = () => {
  const setColor = colorStore((state) => state.setColor);
  const setCursorHidden = cursorHideStore((state) => state.setCursorHidden);
  const { selectedGroup, setSelectedGroup } = groupQueryStore();
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

  useEffect(() => {
    setColor("blue");
    const hideOnHoverElements = document.querySelectorAll(".hide-on-hover");
    hideOnHoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setCursorHidden(true));
      element.addEventListener("mouseleave", () => setCursorHidden(false));
    });

    return () => {
      setCursorHidden(false);
      setSelectedGroup(null);
      hideOnHoverElements.forEach((element) => {
        element.removeEventListener("mouseenter", () => setCursorHidden(true));
        element.removeEventListener("mouseleave", () => setCursorHidden(false));
      });
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a group</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 items-center">
        <GroupSelector />
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
      </CardContent>
    </Card>
  );
};

export default Schedules;
