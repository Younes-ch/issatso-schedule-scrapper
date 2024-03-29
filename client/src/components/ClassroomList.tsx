import useClassroomNames from "@/hooks/useClassroomNames";
import { cn } from "@/lib/utils";
import classroomQueryStore from "@/stores/classroomQueryStore";
import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";

interface ClassroomListProps {
  setOpen: (open: boolean) => void;
}

const ClassroomList = ({ setOpen }: ClassroomListProps) => {
  const { data: classroomNames } = useClassroomNames();
  const { selectedClassroom, setSelectedClassroom } = classroomQueryStore();
  return (
    <Command>
      <CommandInput placeholder="Filter classrooms..." />
      <ScrollArea className="h-56 overflow-auto">
        <CommandEmpty>No classroom found.</CommandEmpty>
        <CommandGroup>
          {classroomNames?.map((classroom) => (
            <CommandItem
              key={classroom.value}
              value={classroom.value}
              onSelect={(value) => {
                setSelectedClassroom(
                  classroomNames.find(
                    (classroom) => classroom.value === value
                  ) || null
                );
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedClassroom?.value === classroom.value
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
              {classroom.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
};

export default ClassroomList;
