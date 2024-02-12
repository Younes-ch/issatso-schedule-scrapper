import Group from "@/entities/group";
import axiosInstance from "./api-client";

interface FetchGroupNamesResponse {
    group_names: string[];
}



class GroupClient {
    constructor() { }

    getGroupNames = () => {
        return axiosInstance.get<FetchGroupNamesResponse>("/groups/names").then((response) => response.data.group_names);
    }

    getGroupSchedules = (groupName: string | null) => {
        if (!groupName) {
            return Promise.resolve(null);
        }
        return axiosInstance.get<Group>(`/groups/${groupName}/`).then((response) => response.data);
    }
}

export default GroupClient;