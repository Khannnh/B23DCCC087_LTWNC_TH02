export type Routine = {
  id: string;
  name: string;
  exerciseIds: string[];
};

export type RoutineAction =
  | { type: 'create'; id: string; name: string }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addExercise'; routineId: string; exerciseId: string }
  | { type: 'removeExercise'; routineId: string; exerciseId: string };

export function routineReducer(state: Routine[], action: RoutineAction): Routine[] {
  switch (action.type) {
    case 'create':
      if (state.some((routine) => routine.id === action.id)) return state;
      return [...state, { id: action.id, name: action.name, exerciseIds: [] }];

    case 'rename': {
      const routineIndex = state.findIndex((routine) => routine.id === action.id);
      if (routineIndex === -1) return state;

      return state.map((routine, index) =>
        index === routineIndex ? { ...routine, name: action.name } : routine,
      );
    }

    case 'remove':
      if (!state.some((routine) => routine.id === action.id)) return state;
      return state.filter((routine) => routine.id !== action.id);

    case 'addExercise': {
      const routineIndex = state.findIndex((routine) => routine.id === action.routineId);
      if (routineIndex === -1) return state;

      const routine = state[routineIndex];
      if (routine.exerciseIds.includes(action.exerciseId)) return state;

      return state.map((item, index) =>
        index === routineIndex
          ? { ...item, exerciseIds: [...item.exerciseIds, action.exerciseId] }
          : item,
      );
    }

    case 'removeExercise': {
      const routineIndex = state.findIndex((routine) => routine.id === action.routineId);
      if (routineIndex === -1) return state;

      const routine = state[routineIndex];
      if (!routine.exerciseIds.includes(action.exerciseId)) return state;

      return state.map((item, index) =>
        index === routineIndex
          ? {
              ...item,
              exerciseIds: item.exerciseIds.filter((id) => id !== action.exerciseId),
            }
          : item,
      );
    }
  }
}