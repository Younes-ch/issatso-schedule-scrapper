import Group from "@/entities/group";
import useMediaQuery from "@/hooks/useMediaQuery";
import groupQueryStore from "@/stores/groupQueryStore";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface TimeTableScheduleProps {
  groupInfo: Group | null | undefined;
}

const TimeTableSchedule = ({ groupInfo }: TimeTableScheduleProps) => {
  const selectedGroup = groupQueryStore((state) => state.selectedGroup);
  const tableCaption = `Timetable of "${selectedGroup}".`;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Table className="timetable-schedule">
        <TableCaption>{tableCaption}</TableCaption>
        <TableHeader>
          <TableRow>
            {groupInfo?.timetable_header.map((header, idx) => (
              <TableHead key={idx} className="text-center">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(groupInfo?.timetable_info_json.num_rows)
            .fill(undefined)
            .map((_, idx) => (
              <TableRow key={idx}>
                {(
                  groupInfo?.timetable_info_json[`row_${idx + 1}`] as string[]
                ).map((row: string, idx: number) => {
                  if (idx == 0)
                    return (
                      <TableCell
                        key={idx}
                        className="text-muted-foreground font-medium"
                      >
                        {row}
                      </TableCell>
                    );
                  return <TableCell key={idx}>{row}</TableCell>;
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }
};

export default TimeTableSchedule;
