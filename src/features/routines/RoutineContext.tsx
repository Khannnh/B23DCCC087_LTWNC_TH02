import { createContext, useEffect, useReducer, type ReactNode } from 'react';
import type { Dispatch } from 'react';
import { routineReducer, type Routine, type RoutineAction } from './routineReducer';
import { withLogger } from './withLogger';

export const RoutineStateContext = createContext<Routine[] | undefined>(undefined);
export const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | undefined>(undefined);

const STORAGE_KEY = 'workout-routines';
const loggedRoutineReducer = withLogger(routineReducer);

function isRoutineArray(value: unknown): value is Routine[] {
  return Array.isArray(value) && value.every(
    (item: unknown) =>
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      typeof item.id === 'string' &&
      'name' in item &&
      typeof item.name === 'string' &&
      'exerciseIds' in item &&
      Array.isArray(item.exerciseIds) &&
      item.exerciseIds.every((id: unknown) => typeof id === 'string'),
  );
}

function initializeRoutines(): Routine[] {
  if (typeof window === 'undefined') return [];

  const storedRoutines = window.localStorage.getItem(STORAGE_KEY);
  if (storedRoutines === null) return [];

  try {
    const parsed: unknown = JSON.parse(storedRoutines);
    if (isRoutineArray(parsed)) return parsed;
    console.error(`Invalid data in localStorage key "${STORAGE_KEY}".`);
  } catch (error) {
    console.error(`Unable to parse localStorage key "${STORAGE_KEY}".`, error);
  }

  return [];
}

interface RoutineProviderProps {
  children: ReactNode;
}

export function RoutineProvider({ children }: RoutineProviderProps) {
  const [routines, dispatch] = useReducer(loggedRoutineReducer, undefined, initializeRoutines);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  }, [routines]);

  return (
    <RoutineStateContext.Provider value={routines}>
      <RoutineDispatchContext.Provider value={dispatch}>
        {children}
      </RoutineDispatchContext.Provider>
    </RoutineStateContext.Provider>
  );
}