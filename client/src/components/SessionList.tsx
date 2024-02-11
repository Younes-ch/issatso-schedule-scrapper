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
import sessionTimes from "@/data/sessionTimes";

interface SessionListProps {
  setOpen: (open: boolean) => void;
}

const SessionList = ({ setOpen }: SessionListProps) => {
  const { selectedWeekday, selectedSession, setSession } =
    availableClassroomsQueryStore((state) => {
      return {
        selectedWeekday: state.availableClassroomsQuery.selectedWeekday,
        selectedSession: state.availableClassroomsQuery.selectedSession,
        setSession: state.setSession,
      };
    });
  const sessions = ["s1", "s2", "s3", "s4", "s4'", "s5", "s6"] as const;
  const getDisabledSessions = (
    weekday:
      | "lundi"
      | "mardi"
      | "mercredi"
      | "jeudi"
      | "vendredi"
      | "samedi"
      | null
  ) => {
    if (weekday === null) return [];
    if (weekday !== "samedi") {
      return ["s4'"];
    } else {
      return ["s4", "s5", "s6"];
    }
  };
  const disabledSessions = getDisabledSessions(selectedWeekday);
  return (
    <Command>
      <CommandInput placeholder="Filter sessions..." />
      <ScrollArea className="h-56 overflow-auto">
        <CommandEmpty>No matching session found.</CommandEmpty>
        <CommandGroup>
          {sessions?.map((session, idx) => (
            <CommandItem
              key={idx}
              value={session}
              disabled={disabledSessions.includes(session)}
              onSelect={(value) => {
                setSession(
                  sessions.find((session) => session === value) || null
                );
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedSession === session ? "opacity-100" : "opacity-0"
                )}
              />
              {`${session.toUpperCase()} - ${sessionTimes[session]}`}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
};

export default SessionList;
