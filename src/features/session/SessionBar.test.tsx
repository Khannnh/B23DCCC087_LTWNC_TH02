import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSessionStore } from './useSessionStore';
import SessionBar from './SessionBar';
import type { Exercise } from '../../types';

const exercise: Exercise = {
  id: 'e1',
  name: 'Đẩy tạ đơn 1',
  trainer: 'Minh Khang',
  group: 'Ngực',
  duration: 30,
};

beforeEach(() => {
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
});

describe('SessionBar', () => {
  it('hiển thị trạng thái chưa bắt đầu và vô hiệu hóa nút bắt đầu', () => {
    render(<SessionBar />);

    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeDisabled();
    expect(screen.getByText('Buổi tập: 0 bài')).toBeInTheDocument();
  });

  it('điều khiển buổi tập và gọi tick mỗi giây khi đang chạy', () => {
    vi.useFakeTimers();
    useSessionStore.getState().startSession([exercise], 0);
    const tick = vi.spyOn(useSessionStore.getState(), 'tick');

    render(<SessionBar />);
    expect(screen.getByText(/Đang tập: Đẩy tạ đơn 1/)).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 1 bài')).toBeInTheDocument();
    expect(screen.getByText('Còn lại: 0:30')).toBeInTheDocument();

    vi.advanceTimersByTime(1000);
    expect(tick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    expect(tick).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
