import classrooms from "@/data/classrooms";
import ClassroomClient from "@/services/classroom-client";
import { useQuery } from "@tanstack/react-query";

const classroomApiClient = new ClassroomClient();

const useClassroomNames = () => useQuery({
    queryKey: ["classroomNames"],
    queryFn: classroomApiClient.getClassroomNames,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    initialData: classrooms,
    retry: 1,
});

export default useClassroomNames;