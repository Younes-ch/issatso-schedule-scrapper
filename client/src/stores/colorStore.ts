import { create } from "zustand";

interface ColorStore {
    color: "blue" | "red";
    setColor: (color: "blue" | "red") => void;
}

const colorStore = create<ColorStore>((set) => ({
    color: "blue",
    setColor: (color: "blue" | "red") => set({ color }),
}));

export default colorStore;