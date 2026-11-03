import { beforeEach, describe, expect, it } from 'vitest';
import { useSavedStore } from './useSavedStore';

beforeEach(() => {
  window.localStorage.clear();
  useSavedStore.setState({ ids: [] });
});

describe('useSavedStore', () => {
  it('lưu id khi bật lưu và xóa id khi tắt lưu', () => {
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e1']);

    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual([]);
  });

  it('lưu danh sách id với key workout-saved', () => {
    useSavedStore.getState().toggle('e2');

    expect(window.localStorage.getItem('workout-saved')).toContain('"e2"');
  });
});
