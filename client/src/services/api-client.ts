import axios from "axios";

interface FetchResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}


const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/",
});

class APIClient<T> {

    constructor(private endpoint: string) { }
    
    getGroupNames = () => {
        return axiosInstance.get<T>(`${this.endpoint}/names`).then((response) => response.data);
    }

    getGroups = () => {
        return axiosInstance.get<FetchResponse<T>>(`${this.endpoint}/`).then((response) => response.data);
    }
}

export default APIClient;
