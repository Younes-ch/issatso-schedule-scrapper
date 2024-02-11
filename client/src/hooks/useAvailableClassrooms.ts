import ClassroomClient from "@/services/classroom-client";
import { AvailableClassroomsQuery } from "@/stores/availableClassroomsQueryStore";
import { useQuery } from "@tanstack/react-query";

const classroomApiClient = new ClassroomClient();

const useAvailableClassrooms = (availableClassroomsQuery: AvailableClassroomsQuery) => useQuery({
    queryKey: ["availableClassrooms", availableClassroomsQuery],
    queryFn: () => classroomApiClient.getAvailableClassrooms({
        params: {
            weekday: availableClassroomsQuery.selectedWeekday,
            session: availableClassroomsQuery.selectedSession,
        },
    }),
    enabled: Boolean(availableClassroomsQuery.selectedWeekday && availableClassroomsQuery.selectedSession),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
});

export default useAvailableClassrooms;