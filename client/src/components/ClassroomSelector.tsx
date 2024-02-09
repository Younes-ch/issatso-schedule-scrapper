import useMediaQuery from "@/hooks/useMediaQuery";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import ClassroomList from "./ClassroomList";
import { ChevronsUpDown } from "lucide-react";
import classroomQueryStore from "@/stores/classroomQueryStore";

const ClassroomSelector = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedClassroom = classroomQueryStore(
    (state) => state.selectedClassroom
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
            {selectedClassroom ? (
              <>{selectedClassroom.label}</>
            ) : (
              <>Select a classroom</>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ClassroomList setOpen={setOpen} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit justify-between">
          {selectedClassroom ? (
            <>{selectedClassroom.label}</>
          ) : (
            <>Select a classroom</>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ClassroomList setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ClassroomSelector;
