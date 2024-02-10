import { create } from "zustand";

interface CursorHideStore {
    cursorHidden: boolean;
    setCursorHidden: (hidden: boolean) => void;
}

const cursorHideStore = create<CursorHideStore>((set) => ({
    cursorHidden: false,
    setCursorHidden: (hidden: boolean) => set({ cursorHidden: hidden }),
}));

export default cursorHideStore;