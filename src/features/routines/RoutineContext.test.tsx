import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RoutineProvider } from './RoutineContext';
import { useRoutineDispatch, useRoutines } from './RoutineHooks';

function RoutineStateView() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();

  return (
    <>
      <p>{routines.map((routine) => routine.name).join(', ') || 'Không có giáo án'}</p>
      <button onClick={() => dispatch({ type: 'create', id: 'routine-2', name: 'Ngày lưng' })}>
        Tạo giáo án kiểm tra
      </button>
    </>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('RoutineProvider', () => {
  it('đọc giáo án hợp lệ từ localStorage và ghi lại khi state đổi', async () => {
    window.localStorage.setItem('workout-routines', JSON.stringify([
      { id: 'routine-1', name: 'Ngày ngực', exerciseIds: ['e1'] },
    ]));
    render(
      <RoutineProvider>
        <RoutineStateView />
      </RoutineProvider>,
    );

    expect(screen.getByText('Ngày ngực')).toBeInTheDocument();
    screen.getByRole('button', { name: 'Tạo giáo án kiểm tra' }).click();

    expect(await screen.findByText('Ngày ngực, Ngày lưng')).toBeInTheDocument();
    expect(window.localStorage.getItem('workout-routines')).toContain('Ngày lưng');
  });

  it('xử lý JSON lỗi và khởi tạo danh sách rỗng', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('workout-routines', '{');

    render(
      <RoutineProvider>
        <RoutineStateView />
      </RoutineProvider>,
    );

    expect(screen.getByText('Không có giáo án')).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('bỏ qua dữ liệu localStorage không đúng cấu trúc', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('workout-routines', JSON.stringify([{ id: 1 }]));

    render(
      <RoutineProvider>
        <RoutineStateView />
      </RoutineProvider>,
    );

    expect(screen.getByText('Không có giáo án')).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
