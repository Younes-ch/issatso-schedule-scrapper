import { create } from "zustand";

interface AvailableClassroomsQuery {
    selectedWeekday: "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi" | null;
    selectedSession: "s1" | "s2" | "s3" | "s4" | "s4'" | "s5" | "s6" | null;
}

interface AvailableClassroomsQueryStore {
    availableClassroomsQuery: AvailableClassroomsQuery;
    setWeekday: (weekday: AvailableClassroomsQuery["selectedWeekday"]) => void;
    setSession: (session: AvailableClassroomsQuery["selectedSession"]) => void;
}

const availableClassroomsQueryStore = create<AvailableClassroomsQueryStore>((set) => ({
    availableClassroomsQuery: {
        selectedWeekday: null,
        selectedSession: null,
    },
    setWeekday: (weekday) => set((state) => ({ availableClassroomsQuery: { ...state.availableClassroomsQuery, selectedWeekday: weekday } })),
    setSession: (session) => set((state) => ({ availableClassroomsQuery: { ...state.availableClassroomsQuery, selectedSession: session } })),
}));

export default availableClassroomsQueryStore;