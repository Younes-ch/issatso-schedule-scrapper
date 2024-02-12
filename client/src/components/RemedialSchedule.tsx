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

const RemedialSchedule = React.forwardRef<HTMLDivElement>((_, ref) => {
  const setColor = colorStore((state) => state.setColor);
  const selectedGroup = groupQueryStore((state) => state.selectedGroup);
  const tableCaption = `Remedial table of "${selectedGroup}".`;
  const {
    data: groupInfo,
    isLoading,
    error,
  } = useGroupSchedules(selectedGroup);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  if (isDesktop) {
    return (
      <div ref={ref} className="w-full flex justify-center">
        <Table>
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
      </div>
    );
  }
});

export default RemedialSchedule;
