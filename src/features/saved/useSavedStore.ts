import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((state) => ({
        ids: state.ids.includes(id) ? state.ids.filter(i => i !== id) : [...state.ids, id]
      })),
    }),
    { name: 'workout-saved' }
  )
);