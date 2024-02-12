import useMediaQuery from "@/hooks/useMediaQuery";
import groupQueryStore from "@/stores/groupQueryStore";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import GroupList from "./GroupList";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const GroupSelector = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedGroup = groupQueryStore((state) => state.selectedGroup);
  const buttonLabel = selectedGroup ? selectedGroup : "Select a group";

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
            {buttonLabel}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <GroupList setOpen={setOpen} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit justify-between">
          {buttonLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <GroupList setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GroupSelector;
