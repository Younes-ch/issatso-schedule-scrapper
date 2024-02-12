import { create } from 'zustand';

interface GroupQuery {
    selectedGroup: string | null;
    setSelectedGroup: (group: string | null) => void;
}

const groupQueryStore = create<GroupQuery>(set => ({
    selectedGroup: null,
    setSelectedGroup: (group: string | null) => set({ selectedGroup: group }),
}))

export default groupQueryStore;