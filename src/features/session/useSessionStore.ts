import { create } from 'zustand';
import type { Exercise } from '../../types';

interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,

  startSession: (exercises, startIndex) => {
    set({
      queue: exercises,
      currentIndex: startIndex >= 0 && startIndex < exercises.length ? startIndex : 0,
      isRunning: true, // Tự động chạy đồng hồ ngay khi bấm bắt đầu
      elapsed: 0,
    });
  },

  toggleRun: () => {
    const { currentIndex } = get();
    if (currentIndex >= 0) {
      set((state) => ({ isRunning: !state.isRunning }));
    }
  },

  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex < queue.length - 1) {
      set({ currentIndex: currentIndex + 1, elapsed: 0 });
    } else {
      set({ isRunning: false });
    }
  },

  prev: () => {
    const { elapsed, currentIndex } = get();
    if (elapsed > 3) {
      set({ elapsed: 0 });
    } else if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, elapsed: 0 });
    } else {
      set({ elapsed: 0 });
    }
  },

  addToSession: (exercise) => {
    set((state) => {
      if (state.queue.some((e) => e.id === exercise.id)) return state;
      return { queue: [...state.queue, exercise] };
    });
  },

  tick: () => {
    const { currentIndex, queue, elapsed } = get();
    if (currentIndex < 0 || currentIndex >= queue.length) return;

    const currentExercise = queue[currentIndex];
    if (elapsed + 1 >= currentExercise.duration) {
      get().next();
    } else {
      set({ elapsed: elapsed + 1 });
    }
  },
}));