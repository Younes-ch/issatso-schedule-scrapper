import GroupClient from "@/services/group-client";
import { useQuery } from "@tanstack/react-query";

const groupApiClient = new GroupClient();

const useGroupSchedules = (groupName: string | null) => useQuery({
    queryKey: ["groupSchedules", groupName],
    queryFn: () => groupApiClient.getGroupSchedules(groupName),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
});

export default useGroupSchedules;
