import { englishDays, frenchDays } from "@/data/days";
import sessionTimes from "@/data/sessionTimes";
import useAvailableClassrooms from "@/hooks/useAvailableClassrooms";
import useMediaQuery from "@/hooks/useMediaQuery";
import capitalize from "@/services/capitalize-word";
import availableClassroomsQueryStore from "@/stores/availableClassroomsQueryStore";
import classroomQueryStore from "@/stores/classroomQueryStore";
import colorStore from "@/stores/colorStore";
import { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const AvailableClassroomsTable = () => {
  const setColor = colorStore((state) => state.setColor);
  const availableClassroomsQuery = availableClassroomsQueryStore(
    (state) => state.availableClassroomsQuery
  );
  const setSelectedClassroom = classroomQueryStore(
    (state) => state.setSelectedClassroom
  );
  const {
    data: availableClassrooms,
    isLoading,
    error,
  } = useAvailableClassrooms(availableClassroomsQuery);

  useEffect(() => {
    if (error) {
      setColor("red");
    } else {
      setColor("blue");
    }
  }, [error]);

  const blocs = ["A", "B", "F", "G", "H", "I", "J", "K", "L", "M"] as const;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isLoading) {
    return <Loader />;
  }

  if (
    !availableClassroomsQuery.selectedWeekday ||
    !availableClassroomsQuery.selectedSession
  ) {
    return null;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isDesktop) {
    return (
      <Table>
        <TableCaption>
          Available classrooms in{" "}
          {capitalize(
            englishDays[
              frenchDays.indexOf(availableClassroomsQuery.selectedWeekday)
            ]
          )}
          ,{" "}
          {availableClassroomsQuery.selectedSession.toUpperCase() +
            " (" +
            sessionTimes[availableClassroomsQuery.selectedSession] +
            ")"}
          .
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Bloc</TableHead>
            <TableHead className="w-[100px]">Available classrooms</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-left">
          {blocs.map((bloc) => {
            if (availableClassrooms![bloc].length === 0) {
              return null;
            }
            return (
              <TableRow key={bloc} className="hover:bg-transparent">
                <TableCell className="font-medium text-muted-foreground">
                  {bloc}
                </TableCell>
                <TableCell className="text-nowrap">
                  {availableClassrooms![bloc].map((classroom, idx) => (
                    <TooltipProvider
                      key={idx}
                      delayDuration={150}
                      skipDelayDuration={100}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className="p-2 py-1 rounded-md hover:bg-primary/50 hover:cursor-pointer hover:underline"
                            onClick={() => setSelectedClassroom(classroom)}
                          >
                            {classroom.label}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="text-seconday">
                          <p>Check "{classroom.label}" availability</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
};

export default AvailableClassroomsTable;
