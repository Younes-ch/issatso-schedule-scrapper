import Classroom from "@/entities/classroom";
import ClassroomClient from "@/services/classroom-client";
import { useQuery } from "@tanstack/react-query";

const classroomApiClient = new ClassroomClient();

const useClassroomAvailability = (selectedClassroom: Classroom | null) => useQuery({
    queryKey: ["classroom", selectedClassroom?.value],
    queryFn: () => classroomApiClient.getClassroomAvailability(selectedClassroom?.value),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
});

export default useClassroomAvailability;