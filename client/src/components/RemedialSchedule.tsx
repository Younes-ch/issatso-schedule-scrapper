import Group from "@/entities/group";
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

interface RemedialScheduleProps {
  groupInfo: Group | null | undefined;
}

const RemedialSchedule = ({ groupInfo }: RemedialScheduleProps) => {
  const selectedGroup = groupQueryStore((state) => state.selectedGroup);
  const tableCaption = `Remedial table of "${selectedGroup}".`;

  return (
    <Table className="remedial-schedule mb-5">
      <TableCaption>{tableCaption}</TableCaption>
      <TableHeader>
        <TableRow>
          {groupInfo?.remedial_header.map((header, idx) => (
            <TableHead key={idx} className="text-center">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array(groupInfo?.remedial_info_json.num_rows)
          .fill(undefined)
          .map((_, idx) => (
            <TableRow key={idx}>
              {(
                groupInfo?.remedial_info_json[`row_${idx + 1}`] as string[]
              ).map((row: string, idx: number) => {
                if (groupInfo?.remedial_info_json.num_rows === 1)
                  return (
                    <TableCell
                      key={idx}
                      colSpan={groupInfo?.remedial_header.length}
                      className="text-red-400"
                    >
                      No remedial sessions for this group.
                    </TableCell>
                  );
                return <TableCell key={idx}>{row}</TableCell>;
              })}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default RemedialSchedule;
