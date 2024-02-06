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
import classroomQueryStore from "@/stores/classroomQueryStore";
import { useEffect } from "react";

const ClassroomAvailabilityTable = () => {
  const selectedClassroom = classroomQueryStore(
    (state) => state.selectedClassroom
  );
  const { data: classroomAvailability } =
    useClassroomAvailability(selectedClassroom);

  useEffect(() => {}, [selectedClassroom]);

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
                {classroomAvailability?.[frenchDay]?.[session] !== undefined ? (
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
};

export default ClassroomAvailabilityTable;
