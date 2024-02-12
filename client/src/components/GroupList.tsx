import useGroupNames from "@/hooks/useGroupNames";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import groupQueryStore from "@/stores/groupQueryStore";

interface GroupListProps {
  setOpen: (open: boolean) => void;
}

const GroupList = ({ setOpen }: GroupListProps) => {
  const { data: groupNames } = useGroupNames();
  const { selectedGroup, setSelectedGroup } = groupQueryStore();
  return (
    <Command>
      <CommandInput placeholder="Filter classrooms..." />
      <ScrollArea className="h-56 overflow-auto">
        <CommandEmpty>No matching group found.</CommandEmpty>
        <CommandGroup>
          {groupNames?.map((group, idx) => (
            <CommandItem
              key={idx}
              value={group}
              onSelect={(value) => {
                setSelectedGroup(
                  groupNames.find((group) => group.toLowerCase() === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedGroup === group ? "opacity-100" : "opacity-0"
                )}
              />
              {group}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
};

export default GroupList;
