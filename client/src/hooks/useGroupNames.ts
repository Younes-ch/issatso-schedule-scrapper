import groupNames from "@/data/groups";
import GroupClient from "@/services/group-client";
import { useQuery } from "@tanstack/react-query";

const groupApiClient = new GroupClient();

const useGroupNames = () => useQuery({
    queryKey: ["groupNames"],
    queryFn: groupApiClient.getGroupNames,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
    initialData: groupNames,
});

export default useGroupNames;