import useMediaQuery from "@/hooks/useMediaQuery";
import availableClassroomsQueryStore from "@/stores/availableClassroomsQueryStore";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "./ui/drawer";
import SessionList from "./SessionList";

const SessionSelector = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedSession = availableClassroomsQueryStore(
    (state) => state.availableClassroomsQuery.selectedSession
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-fit justify-between"
            aria-expanded={open}
            role="combobox"
          >
            {selectedSession ? (
              <>{selectedSession.toUpperCase()}</>
            ) : (
              <>Pick a session</>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <SessionList setOpen={setOpen} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit justify-between">
          {selectedSession ? <>{selectedSession.toUpperCase()}</> : <>Pick a session</>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <SessionList setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

export default SessionSelector;
