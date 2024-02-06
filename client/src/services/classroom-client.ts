import Classroom from "@/entities/classroom";
import axiosInstance from "./api-client";

interface FetchClassroomNamesResponse {
    classrooms: Classroom[];
}

interface SessionAvailability {
    S1: boolean;
    S2: boolean;
    S3: boolean;
    S4?: boolean;
    "S4'"?: boolean;
    S5?: boolean;
    S6?: boolean;
}

interface FetchClassroomAvailabilityResponse {
    "Lundi": SessionAvailability;
    "Mardi": SessionAvailability;
    "Mercredi": SessionAvailability;
    "Jeudi": SessionAvailability;
    "Vendredi": SessionAvailability;
    "Samedi": SessionAvailability;
}


class ClassroomClient {
    constructor() { }

    getClassroomNames = () => {
        return axiosInstance.get<FetchClassroomNamesResponse>("/classrooms/").then((response) => response.data.classrooms);
    }

    getClassroomAvailability = (classroom: string | undefined) => {
        if (!classroom) {
            return Promise.resolve(null);
        }
        return axiosInstance.get<FetchClassroomAvailabilityResponse>(`/classrooms/available/${classroom}/`).then((response) => response.data);
    }
}

export default ClassroomClient;