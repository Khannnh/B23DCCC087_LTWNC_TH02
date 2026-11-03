import { describe, expect, it } from 'vitest';
import { routineReducer, type Routine } from './routineReducer';

const initialState: Routine[] = [
  { id: 'routine-1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
];

describe('routineReducer', () => {
  it('tạo giáo án mới với danh sách bài rỗng', () => {
    expect(routineReducer([], { type: 'create', id: 'routine-1', name: 'Ngày ngực' })).toEqual([
      { id: 'routine-1', name: 'Ngày ngực', exerciseIds: [] },
    ]);
  });

  it('thêm bài tập nhưng không thêm trùng', () => {
    const withExercise = routineReducer(initialState, {
      type: 'addExercise',
      routineId: 'routine-1',
      exerciseId: 'e3',
    });

    expect(withExercise[0].exerciseIds).toEqual(['e1', 'e2', 'e3']);
    expect(routineReducer(withExercise, {
      type: 'addExercise',
      routineId: 'routine-1',
      exerciseId: 'e3',
    })).toBe(withExercise);
  });

  it('xóa bài tập khỏi giáo án', () => {
    expect(routineReducer(initialState, {
      type: 'removeExercise',
      routineId: 'routine-1',
      exerciseId: 'e1',
    })[0].exerciseIds).toEqual(['e2']);
  });

  it('giữ nguyên state khi xóa giáo án không tồn tại', () => {
    expect(routineReducer(initialState, { type: 'remove', id: 'missing' })).toEqual(initialState);
  });

  it('đổi tên giáo án', () => {
    expect(routineReducer(initialState, {
      type: 'rename',
      id: 'routine-1',
      name: 'Buổi tập ngực',
    })[0].name).toBe('Buổi tập ngực');
  });

  it('không mutate state cũ khi thêm bài tập', () => {
    const oldState: Routine[] = [
      { id: 'routine-1', name: 'Ngày ngực', exerciseIds: ['e1'] },
    ];
    const oldRoutine = oldState[0];
    const oldExerciseIds = oldRoutine.exerciseIds;

    const nextState = routineReducer(oldState, {
      type: 'addExercise',
      routineId: 'routine-1',
      exerciseId: 'e2',
    });

    expect(oldState).toEqual([{ id: 'routine-1', name: 'Ngày ngực', exerciseIds: ['e1'] }]);
    expect(nextState).not.toBe(oldState);
    expect(nextState[0]).not.toBe(oldRoutine);
    expect(nextState[0].exerciseIds).not.toBe(oldExerciseIds);
  });

  it('xóa giáo án đang tồn tại', () => {
    expect(routineReducer(initialState, { type: 'remove', id: 'routine-1' })).toEqual([]);
  });

  it('không tạo giáo án trùng id', () => {
    expect(routineReducer(initialState, {
      type: 'create',
      id: 'routine-1',
      name: 'Tên khác',
    })).toBe(initialState);
  });

  it('giữ nguyên state khi đổi tên id không tồn tại', () => {
    expect(routineReducer(initialState, {
      type: 'rename',
      id: 'missing',
      name: 'Tên mới',
    })).toBe(initialState);
  });

  it('giữ nguyên state khi xóa bài không tồn tại trong giáo án', () => {
    expect(routineReducer(initialState, {
      type: 'removeExercise',
      routineId: 'routine-1',
      exerciseId: 'missing',
    })).toBe(initialState);
  });
});
