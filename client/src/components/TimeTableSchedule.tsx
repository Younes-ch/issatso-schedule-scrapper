import useGroupSchedules from "@/hooks/useGroupSchedules";
import useMediaQuery from "@/hooks/useMediaQuery";
import colorStore from "@/stores/colorStore";
import groupQueryStore from "@/stores/groupQueryStore";
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

const TimeTableSchedule = React.forwardRef<HTMLDivElement>((_, ref) => {
  const setColor = colorStore((state) => state.setColor);
  const selectedGroup = groupQueryStore((state) => state.selectedGroup);
  const tableCaption = `Timetable of "${selectedGroup}".`;
  const {
    data: groupInfo,
    isLoading,
    error,
  } = useGroupSchedules(selectedGroup);

  useEffect(() => {
    if (error) {
      setColor("red");
    } else {
      setColor("blue");
    }
  }, [error]);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!selectedGroup) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isDesktop) {
    return (
      <div ref={ref} className="w-full flex justify-center">
        <Table>
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
      </div>
    );
  }
});

export default TimeTableSchedule;
