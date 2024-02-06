import Classroom from '@/entities/classroom';
import { create } from 'zustand';

interface ClassroomQuery {
    selectedClassroom: Classroom | null;
    setSelectedClassroom: (classroom: Classroom | null) => void;
}

const classroomQueryStore = create<ClassroomQuery>(set => ({
    selectedClassroom: null,
    setSelectedClassroom: (classroom: Classroom | null) => set({ selectedClassroom: classroom }),
}))

export default classroomQueryStore;