import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RoutineProvider } from './RoutineContext';
import RoutinesPage from './RoutinesPage';

function renderWithProviders() {
  return render(
    <RoutineProvider>
      <MemoryRouter>
        <RoutinesPage />
      </MemoryRouter>
    </RoutineProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('RoutinesPage', () => {
  it('hiển thị lỗi khi tạo giáo án với tên trống', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(await screen.findByText('Tên giáo án không được để trống')).toBeInTheDocument();
  });

  it('tạo và hiển thị tên giáo án mới', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Tên giáo án'), 'Ngày ngực');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(await screen.findByText('Ngày ngực')).toBeInTheDocument();
  });

  it('không cho tạo tên trùng khi khác chữ hoa chữ thường', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Tên giáo án'), 'Ngày ngực');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    await user.type(screen.getByLabelText('Tên giáo án'), 'NGÀY NGỰC');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(await screen.findByText('Tên giáo án đã tồn tại')).toBeInTheDocument();
  });
});
