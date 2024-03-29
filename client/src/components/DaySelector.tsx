import { englishDays, frenchDays } from "@/data/days";
import useMediaQuery from "@/hooks/useMediaQuery";
import capitalize from "@/services/capitalize-word";
import availableClassroomsQueryStore from "@/stores/availableClassroomsQueryStore";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import DayList from "./DayList";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const DaySelector = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedWeekday = availableClassroomsQueryStore(
    (state) => state.availableClassroomsQuery.selectedWeekday
  );
  const buttonLabel = selectedWeekday
    ? capitalize(englishDays[frenchDays.indexOf(selectedWeekday)])
    : "Pick a day";

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
          <DayList setOpen={setOpen} />
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
          <DayList setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default DaySelector;
