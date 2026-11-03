import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useRoutineDispatch, useRoutines } from './RoutineHooks';

describe('Routine hooks', () => {
  it('báo lỗi rõ ràng khi useRoutines dùng ngoài Provider', () => {
    expect(() => renderHook(() => useRoutines())).toThrow(
      'useRoutines must be used within a RoutineProvider.',
    );
  });

  it('báo lỗi rõ ràng khi useRoutineDispatch dùng ngoài Provider', () => {
    expect(() => renderHook(() => useRoutineDispatch())).toThrow(
      'useRoutineDispatch must be used within a RoutineProvider.',
    );
  });
});
