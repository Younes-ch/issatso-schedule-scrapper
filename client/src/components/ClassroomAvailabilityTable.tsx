import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useClassroomAvailability from "@/hooks/useClassroomAvailability";
import useMediaQuery from "@/hooks/useMediaQuery";
import classroomQueryStore from "@/stores/classroomQueryStore";
import colorStore from "@/stores/colorStore";
import React, { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";

const ClassroomAvailabilityTable = () => {
  const setColor = colorStore((state) => state.setColor);
  const selectedClassroom = classroomQueryStore(
    (state) => state.selectedClassroom
  );
  const tableCaption = `"${selectedClassroom?.label}" availability in the current week.`;
  const {
    data: classroomAvailability,
    isLoading,
    error,
  } = useClassroomAvailability(selectedClassroom);

  useEffect(() => {
    if (error) {
      setColor("red");
    } else {
      setColor("blue");
    }
  }, [error]);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!selectedClassroom) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  const days = [
    { frenchDay: "Lundi", englishDay: "Monday" },
    { frenchDay: "Mardi", englishDay: "Tuesday" },
    { frenchDay: "Mercredi", englishDay: "Wednesday" },
    { frenchDay: "Jeudi", englishDay: "Thursday" },
    { frenchDay: "Vendredi", englishDay: "Friday" },
    { frenchDay: "Samedi", englishDay: "Saturday" },
  ] as const;

  const sessions = ["S1", "S2", "S3", "S4'", "S4", "S5", "S6"] as const;

  if (isDesktop) {
    return (
      <Table>
        <TableCaption>{tableCaption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Day</TableHead>
            {sessions.map((session) => (
              <TableHead key={session}>{session}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-left">
          {days.map(({ frenchDay, englishDay }) => (
            <TableRow key={frenchDay}>
              <TableCell className="font-medium text-muted-foreground">
                {englishDay}
              </TableCell>
              {sessions.map((session) => (
                <TableCell key={session}>
                  {classroomAvailability?.[frenchDay]?.[session] !==
                  undefined ? (
                    classroomAvailability[frenchDay][session] ? (
                      <span className="text-lime-500">Free</span>
                    ) : (
                      <span className="text-red-500">Occupied</span>
                    )
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table className="classroom-availability">
      <TableCaption>{tableCaption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Day</TableHead>
          <TableHead>Session</TableHead>
          <TableHead>Availability</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-left">
        {days.map(({ frenchDay, englishDay }) => (
          <React.Fragment key={frenchDay}>
            {sessions.map((session) => (
              <TableRow key={`${frenchDay}-${session}`} className="hover:bg-transparent">
                {session === "S1" && (
                  <TableCell
                    rowSpan={sessions.length}
                    className="font-medium"
                    style={{ verticalAlign: "center" }}
                  >
                    {englishDay}
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground">
                  {session}
                </TableCell>
                <TableCell>
                  {classroomAvailability?.[frenchDay]?.[session] !==
                  undefined ? (
                    classroomAvailability[frenchDay][session] ? (
                      <span className="text-lime-500">Free</span>
                    ) : (
                      <span className="text-red-500">Occupied</span>
                    )
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClassroomAvailabilityTable;
