import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExerciseRow } from './ExerciseRow';
import type { Exercise } from '../../types';

const exercise: Exercise = {
  id: 'e1',
  name: 'Đẩy tạ đơn 1',
  trainer: 'Minh Khang',
  group: 'Ngực',
  duration: 30,
};

describe('ExerciseRow', () => {
  it('hiển thị tên và thời lượng của bài tập', () => {
    render(
      <ExerciseRow
        exercise={exercise}
        index={0}
        style={{}}
        onStart={vi.fn()}
        onAddToSession={vi.fn()}
        onAddToRoutine={vi.fn()}
        addToRoutineDisabled={false}
        onToggleSave={vi.fn()}
        isSaved={false}
      />,
    );

    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });

  it('gọi onStart với đúng bài khi bấm Bắt đầu', () => {
    const onStart = vi.fn();

    render(
      <ExerciseRow
        exercise={exercise}
        index={0}
        style={{}}
        onStart={onStart}
        onAddToSession={vi.fn()}
        onAddToRoutine={vi.fn()}
        addToRoutineDisabled={false}
        onToggleSave={vi.fn()}
        isSaved={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /bắt đầu/i }));

    expect(onStart).toHaveBeenCalledWith(exercise);
  });

  it('gọi các callback thêm buổi tập, thêm giáo án và lưu bài', () => {
    const onAddToSession = vi.fn();
    const onAddToRoutine = vi.fn();
    const onToggleSave = vi.fn();
    render(
      <ExerciseRow
        exercise={exercise}
        index={0}
        style={{}}
        onStart={vi.fn()}
        onAddToSession={onAddToSession}
        onAddToRoutine={onAddToRoutine}
        addToRoutineDisabled={false}
        onToggleSave={onToggleSave}
        isSaved={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '+ Buổi tập' }));
    fireEvent.click(screen.getByRole('button', { name: '+ Giáo án' }));
    fireEvent.click(screen.getByRole('button', { name: 'Lưu bài tập' }));

    expect(onAddToSession).toHaveBeenCalledWith(exercise);
    expect(onAddToRoutine).toHaveBeenCalledWith('e1');
    expect(onToggleSave).toHaveBeenCalledWith('e1');
  });

  it('khóa nút thêm giáo án khi chưa có giáo án', () => {
    render(
      <ExerciseRow
        exercise={exercise}
        index={0}
        style={{}}
        onStart={vi.fn()}
        onAddToSession={vi.fn()}
        onAddToRoutine={vi.fn()}
        addToRoutineDisabled
        addToRoutineTitle="Hãy tạo giáo án trước"
        onToggleSave={vi.fn()}
        isSaved
      />,
    );

    expect(screen.getByRole('button', { name: '+ Giáo án' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '+ Giáo án' })).toHaveAttribute('title', 'Hãy tạo giáo án trước');
    expect(screen.getByRole('button', { name: 'Bỏ lưu' })).toHaveTextContent('★');
  });
});
