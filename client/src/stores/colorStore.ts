import { create } from 'zustand';

interface ColorStore {
    color: "primary" | "red-600";
    changeColor: (color: "primary" | "red-600") => void;
}
    
const colorStore = create<ColorStore>(set => ({
    color: "primary",
    changeColor: (color) => set({ color })
}));

export default colorStore;