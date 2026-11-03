import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebounce', () => {
  it('chỉ cập nhật giá trị sau khi hết thời gian chờ', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'cũ' } },
    );

    rerender({ value: 'mới' });
    expect(result.current).toBe('cũ');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('cũ');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('mới');
  });
});
