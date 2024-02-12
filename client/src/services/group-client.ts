import axiosInstance from "./api-client";

interface FetchGroupNamesResponse {
    group_names: string[];
}

class GroupClient {
    constructor() { }

    getGroupNames = () => {
        return axiosInstance.get<FetchGroupNamesResponse>("/groups/names").then((response) => response.data.group_names);
    }
}

export default GroupClient;