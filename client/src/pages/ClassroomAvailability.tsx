import ClassroomAvailabilityTable from "@/components/ClassroomAvailabilityTable";
import ClassroomSelector from "@/components/ClassroomSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import classroomQueryStore from "@/stores/classroomQueryStore";
import colorStore from "@/stores/colorStore";
import { useEffect } from "react";

const ClassroomAvailability = () => {
  const setColor = colorStore((state) => state.setColor);
  useEffect(() => {
    setColor("blue");
  }, []);
  const setSelectedClassroom = classroomQueryStore(
    (state) => state.setSelectedClassroom
  );
  useEffect(() => {
    return () => setSelectedClassroom(null);
  }, [setSelectedClassroom]);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Choose a classroom</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 items-center">
          <ClassroomSelector />
          <ClassroomAvailabilityTable />
        </CardContent>
      </Card>
    </>
  );
};

export default ClassroomAvailability;
