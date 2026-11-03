import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSessionStore } from './useSessionStore';
import { CountdownBar } from './CountdownBar';
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

describe('CountdownBar', () => {
  it('không hiển thị khi chưa có bài tập hiện tại', () => {
    const { container } = render(<CountdownBar />);

    expect(container.firstChild).toBeNull();
  });

  it('hiển thị thời gian còn lại và phần trăm tiến trình', () => {
    useSessionStore.setState({ queue: [exercise], currentIndex: 0, elapsed: 15 });
    const { container } = render(<CountdownBar />);

    expect(screen.getByText('Còn lại: 0:15')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(container.querySelector('.session-progress-value')).toHaveStyle({ width: '50%' });
  });

  it('giới hạn tiến trình ở 100 phần trăm', () => {
    useSessionStore.setState({ queue: [exercise], currentIndex: 0, elapsed: 40 });
    render(<CountdownBar />);

    expect(screen.getByText('Còn lại: 0:00')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
