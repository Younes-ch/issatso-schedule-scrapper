import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import availableClassroomsQueryStore from "@/stores/availableClassroomsQueryStore";
import { cn } from "@/lib/utils";

interface DayListProps {
  setOpen: (open: boolean) => void;
}

const DayList = ({ setOpen }: DayListProps) => {
  const { selectedWeekday, setWeekday } = availableClassroomsQueryStore(
    (state) => {
      return {
        selectedWeekday: state.availableClassroomsQuery.selectedWeekday,
        setWeekday: state.setWeekday,
      };
    }
  );
  const englishDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const frenchDays = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ] as const;

  return (
    <Command>
      <CommandInput placeholder="Filter days..." />
      <ScrollArea className="h-56 overflow-auto">
        <CommandEmpty>No matching day found.</CommandEmpty>
        <CommandGroup>
          {englishDays?.map((day, idx) => (
            <CommandItem
                key={idx}
                value={day}
                onSelect={(value) => {
                    setWeekday(
                        frenchDays.find((day) => day === frenchDays[englishDays.indexOf(value as typeof englishDays[number])]) || null
                    );
                    setOpen(false);
                }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedWeekday === frenchDays[idx]
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
};

export default DayList;
