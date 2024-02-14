import useGroupSchedules from "@/hooks/useGroupSchedules";
import colorStore from "@/stores/colorStore";
import groupQueryStore from "@/stores/groupQueryStore";
import { useIntersection } from "@mantine/hooks";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import RemedialSchedule from "./RemedialSchedule";
import ScrollButton from "./ScrollButton";
import TimeTableSchedule from "./TimeTableSchedule";
import useMediaQuery from "@/hooks/useMediaQuery";

const GroupSchedules = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedGroup = groupQueryStore((state) => state.selectedGroup);
  const {
    data: groupInfo,
    isLoading,
    error,
  } = useGroupSchedules(selectedGroup);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });
  const setColor = colorStore((state) => state.setColor);

  useEffect(() => {
    if (error) {
      setColor("red");
    } else {
      setColor("blue");
    }
  }, [error]);

  if (!selectedGroup) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  return (
    <>
      <TimeTableSchedule groupInfo={groupInfo} />
      <div ref={ref} className="w-full flex justify-center">
      <RemedialSchedule groupInfo={groupInfo} />
      </div>
      {isDesktop && (
        <>
          {entry?.isIntersecting ? (
            <ScrollButton
              icon={<ArrowUp />}
              content="Scroll up to Timetable schedule"
              onClick={() => {
                const element = document.querySelector(".timetable-schedule");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ) : (
            <ScrollButton
              icon={<ArrowDown />}
              content="Scroll down to Remedial schedule"
              onClick={() => {
                const element = document.querySelector(".remedial-schedule");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default GroupSchedules;
