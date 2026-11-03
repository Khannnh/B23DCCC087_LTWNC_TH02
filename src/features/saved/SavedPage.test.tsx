import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';
import SavedPage from './SavedPage';

beforeEach(() => {
  window.localStorage.clear();
  useSavedStore.setState({ ids: [] });
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
});

describe('SavedPage', () => {
  it('hiển thị thông báo và khóa nút khi chưa có bài đã lưu', () => {
    render(<SavedPage />);

    expect(screen.getByText('Bạn chưa lưu bài tập nào.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tập tất cả' })).toBeDisabled();
  });

  it('hiển thị bài đã lưu, bỏ lưu và bắt đầu buổi tập với danh sách đó', () => {
    useSavedStore.setState({ ids: ['e1', 'e2', 'missing'] });
    render(<SavedPage />);

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('Kéo tạ đơn 1')).toBeInTheDocument();
    expect(screen.queryByText('missing')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Bỏ lưu' })).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả' }));
    expect(useSessionStore.getState()).toMatchObject({
      queue: expect.arrayContaining([expect.objectContaining({ id: 'e1' }), expect.objectContaining({ id: 'e2' })]),
      currentIndex: 0,
      isRunning: true,
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Bỏ lưu' })[0]);
    expect(useSavedStore.getState().ids).toEqual(['e2', 'missing']);
  });
});
