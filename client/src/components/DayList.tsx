import { englishDays, frenchDays } from "@/data/days";
import { cn } from "@/lib/utils";
import availableClassroomsQueryStore from "@/stores/availableClassroomsQueryStore";
import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";

interface DayListProps {
  setOpen: (open: boolean) => void;
}

const DayList = ({ setOpen }: DayListProps) => {
  const { selectedSession, selectedWeekday, setWeekday } =
    availableClassroomsQueryStore((state) => {
      return {
        selectedSession: state.availableClassroomsQuery.selectedSession,
        selectedWeekday: state.availableClassroomsQuery.selectedWeekday,
        setWeekday: state.setWeekday,
      };
    });
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

  const getDisabledDays = (
    session: "s1" | "s2" | "s3" | "s4" | "s4'" | "s5" | "s6" | null
  ) => {
    if (session === null) return [];
    if (session === "s4'") {
      return ["monday", "tuesday", "wednesday", "thursday", "friday"];
    } else if (session === "s4" || session === "s5" || session === "s6") {
      return ["saturday"];
    }
    return [];
  };
  const disabledDays = getDisabledDays(selectedSession);

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
              disabled={disabledDays.includes(day)}
              onSelect={(value) => {
                setWeekday(
                  frenchDays.find(
                    (day) =>
                      day ===
                      frenchDays[
                        englishDays.indexOf(
                          value as (typeof englishDays)[number]
                        )
                      ]
                  ) || null
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
