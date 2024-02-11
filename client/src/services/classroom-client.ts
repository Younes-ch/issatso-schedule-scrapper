import Classroom from "@/entities/classroom";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "./api-client";

interface FetchClassroomNamesResponse {
    classrooms: Classroom[];
}

type BLOCS = "A" | "B" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M";

type AvailableClassrooms = {
    [K in BLOCS]: Classroom[];
}

interface FetchAvailableClassroomsResponse {
    available_classrooms: AvailableClassrooms;
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

    getAvailableClassrooms = (config: AxiosRequestConfig) => {
        return axiosInstance.get<FetchAvailableClassroomsResponse>("/classrooms/available/", config).then((response) => response.data.available_classrooms);
    }

    getClassroomAvailability = (classroom: string | undefined) => {
        if (!classroom) {
            return Promise.resolve(null);
        }
        return axiosInstance.get<FetchClassroomAvailabilityResponse>(`/classrooms/available/${classroom}/`).then((response) => response.data);
    }
}

export default ClassroomClient;