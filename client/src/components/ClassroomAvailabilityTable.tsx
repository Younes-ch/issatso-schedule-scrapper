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
import React from "react";

const ClassroomAvailabilityTable = () => {
  const selectedClassroom = classroomQueryStore(
    (state) => state.selectedClassroom
  );
  const { data: classroomAvailability } =
    useClassroomAvailability(selectedClassroom);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!selectedClassroom) {
    return null;
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
        <TableCaption>
          A list of classroom availability in the current week.
        </TableCaption>
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
              <TableCell className="font-medium">{englishDay}</TableCell>
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
    <Table>
      <TableCaption>
        A list of classroom availability in the current week.
      </TableCaption>
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
              <TableRow key={`${frenchDay}-${session}`}>
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
