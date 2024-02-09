import BackgroundEffect from "@/components/BackgroundEffect";
import ClassroomAvailabilityTable from "@/components/ClassroomAvailabilityTable";
import ClassroomSelector from "@/components/ClassroomSelector";
import Cursor from "@/components/Cursor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import classroomQueryStore from "@/stores/classroomQueryStore";
import { useEffect } from "react";

const ClassroomAvailability = () => {
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
      <BackgroundEffect color="bg-primary" />
      <Cursor color="bg-primary" />
    </>
  );
};

export default ClassroomAvailability;
