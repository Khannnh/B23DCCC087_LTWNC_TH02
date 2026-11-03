import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RoutineProvider } from './RoutineContext';
import { useSessionStore } from '../session/useSessionStore';
import RoutineDetailPage from './RoutinesDetailPage';

function renderDetail(path: string) {
  window.localStorage.setItem('workout-routines', JSON.stringify([
    { id: 'routine-1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
  ]));

  return render(
    <RoutineProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/routines/:id" element={<RoutineDetailPage />} />
        </Routes>
      </MemoryRouter>
    </RoutineProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
});

describe('RoutineDetailPage', () => {
  it('báo không tìm thấy giáo án với id không tồn tại', () => {
    renderDetail('/routines/missing');

    expect(screen.getByText('Không tìm thấy giáo án')).toBeInTheDocument();
  });

  it('hiển thị thời gian rỗng và khóa bắt đầu nếu bài tập không có trong kho', () => {
    window.localStorage.setItem('workout-routines', JSON.stringify([
      { id: 'routine-1', name: 'Giáo án trống', exerciseIds: ['missing'] },
    ]));
    render(
      <RoutineProvider>
        <MemoryRouter initialEntries={['/routines/routine-1']}>
          <Routes>
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
          </Routes>
        </MemoryRouter>
      </RoutineProvider>,
    );

    expect(screen.getByText('Tổng thời gian: 0 phút 0 giây')).toBeInTheDocument();
    expect(screen.getByText('Giáo án chưa có bài tập nào.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tập tất cả' })).toBeDisabled();
  });

  it('hiển thị bài tập, tổng thời gian, bắt đầu buổi tập và cho bỏ bài', () => {
    renderDetail('/routines/routine-1');

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời gian: 1 phút 37 giây')).toBeInTheDocument();
    expect(screen.getByText(/Đẩy tạ đơn 1/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả' }));
    expect(useSessionStore.getState()).toMatchObject({
      currentIndex: 0,
      isRunning: true,
      elapsed: 0,
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Bỏ' })[0]);
    expect(screen.getByText('Tổng thời gian: 1 phút 7 giây')).toBeInTheDocument();
  });
});
