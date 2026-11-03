import { useContext } from 'react';
import type { Dispatch } from 'react';
import { RoutineDispatchContext, RoutineStateContext } from './RoutineContext';
import type { Routine, RoutineAction } from './routineReducer';

export function useRoutines(): Routine[] {
  const routines = useContext(RoutineStateContext);
  if (routines === undefined) {
    throw new Error('useRoutines must be used within a RoutineProvider.');
  }
  return routines;
}

export function useRoutineDispatch(): Dispatch<RoutineAction> {
  const dispatch = useContext(RoutineDispatchContext);
  if (dispatch === undefined) {
    throw new Error('useRoutineDispatch must be used within a RoutineProvider.');
  }
  return dispatch;
}
