import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { RoutineProvider } from '../routines/RoutineContext';
import { useRoutines } from '../routines/RoutineHooks';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';
import LibraryPage from './LibraryPage';

function RoutineNames() {
  const routines = useRoutines();
  return <p>{routines.map((routine) => `${routine.name}: ${routine.exerciseIds.join(', ')}`).join('; ')}</p>;
}

function renderLibrary(withRoutine = true) {
  window.localStorage.setItem(
    'workout-routines',
    JSON.stringify(withRoutine ? [{ id: 'routine-1', name: 'Ngày ngực', exerciseIds: [] }] : []),
  );

  return render(
    <RoutineProvider>
      <LibraryPage />
      <RoutineNames />
    </RoutineProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
  useSavedStore.setState({ ids: [] });
});

describe('LibraryPage', () => {
  it('chọn giáo án đầu tiên mặc định và thêm bài vào giáo án đó', async () => {
    renderLibrary();

    expect(screen.getByLabelText('Giáo án đang chọn')).toHaveValue('routine-1');
    fireEvent.click(screen.getAllByRole('button', { name: '+ Giáo án' })[0]);

    expect(await screen.findByText('Ngày ngực: e1')).toBeInTheDocument();
  });

  it('khóa nút thêm giáo án khi chưa có giáo án', () => {
    renderLibrary(false);

    expect(screen.getByLabelText('Giáo án đang chọn')).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Chưa có giáo án' })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: '+ Giáo án' })[0]).toBeDisabled();
    expect(screen.getAllByRole('button', { name: '+ Giáo án' })[0]).toHaveAttribute(
      'title',
      'Hãy tạo giáo án trước',
    );
  });

  it('bắt đầu buổi tập từ bài được bấm và cập nhật trạng thái lưu', () => {
    renderLibrary();

    fireEvent.click(screen.getAllByRole('button', { name: 'Bắt đầu' })[1]);
    expect(useSessionStore.getState()).toMatchObject({
      currentIndex: 1,
      queue: expect.arrayContaining([expect.objectContaining({ id: 'e2' })]),
      isRunning: true,
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Lưu bài tập' })[0]);
    expect(useSavedStore.getState().ids).toContain('e1');
  });

  it('lọc theo từ khóa và hiển thị thông báo khi không có kết quả', async () => {
    renderLibrary();

    fireEvent.change(screen.getByPlaceholderText('Tên bài hoặc HLV...'), {
      target: { value: 'khong-co-bai-nay' },
    });
    await waitFor(() => {
      expect(screen.getAllByText('Không tìm thấy bài tập nào')).toHaveLength(2);
    }, { timeout: 1000 });
  });
});
