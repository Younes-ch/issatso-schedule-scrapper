import { englishDays, frenchDays } from "@/data/days";
import sessionTimes from "@/data/sessionTimes";
import useAvailableClassrooms from "@/hooks/useAvailableClassrooms";
import useMediaQuery from "@/hooks/useMediaQuery";
import capitalize from "@/services/capitalize-word";
import availableClassroomsQueryStore from "@/stores/availableClassroomsQueryStore";
import classroomQueryStore from "@/stores/classroomQueryStore";
import colorStore from "@/stores/colorStore";
import React, { useEffect } from "react";
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

interface AvailableClassroomsTableProps {
  scrollIntoView: () => void;
}

const AvailableClassroomsTable = ({
  scrollIntoView,
}: AvailableClassroomsTableProps) => {
  const setColor = colorStore((state) => state.setColor);
  const availableClassroomsQuery = availableClassroomsQueryStore(
    (state) => state.availableClassroomsQuery
  );
  const { setSelectedClassroom } = classroomQueryStore();
  const {
    data: availableClassrooms,
    isLoading,
    error,
  } = useAvailableClassrooms(availableClassroomsQuery);

  const blocs = ["A", "B", "F", "G", "H", "I", "J", "K", "L", "M"] as const;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (error) {
      setColor("red");
    } else {
      setColor("blue");
    }
  }, [error]);

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
            <TableHead className="w-[50px]">Bloc</TableHead>
            <TableHead>Available classrooms</TableHead>
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
                            onClick={() => {
                              setSelectedClassroom(classroom);
                              scrollIntoView();
                            }}
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
          <TableHead className="w-[50px]">Bloc</TableHead>
          <TableHead>Available classrooms</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-left">
        {blocs.map((bloc) => {
          if (availableClassrooms![bloc].length === 0) {
            return null;
          }
          return (
            <React.Fragment key={bloc}>
              {availableClassrooms![bloc].map((classroom) => (
                <TableRow
                  key={classroom.value}
                  className="hover:bg-transparent"
                >
                  {classroom === availableClassrooms![bloc][0] && (
                    <TableCell
                      rowSpan={availableClassrooms![bloc].length}
                      className="font-medium text-muted-foreground"
                      style={{ verticalAlign: "center" }}
                    >
                      {bloc}
                    </TableCell>
                  )}

                  <TableCell
                    className="underline hover:bg-primary/50"
                    onClick={() => {
                      setSelectedClassroom(classroom);
                      scrollIntoView();
                      // setTimeout(() => {
                      //   const element = document.querySelector(
                      //     ".classroom-availability"
                      //   );
                      //   element?.scrollIntoView({ behavior: "smooth" });
                      // }, 100);
                    }}
                  >
                    {classroom.label}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AvailableClassroomsTable;
