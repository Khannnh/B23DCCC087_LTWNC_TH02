import { describe, expect, it } from 'vitest';
import { generateExercises } from './exercises';

describe('generateExercises', () => {
  it('tạo 10.000 bài có id duy nhất và thời lượng trong khoảng 30–120 giây', () => {
    const exercises = generateExercises(10000);
    const ids = new Set(exercises.map((exercise) => exercise.id));

    expect(exercises).toHaveLength(10000);
    expect(ids.size).toBe(10000);
    expect(exercises.every((exercise) => exercise.duration >= 30 && exercise.duration <= 120)).toBe(true);
  });

  it('tạo đúng tên cho ba bài đầu tiên', () => {
    const exercises = generateExercises(3);

    expect(exercises.map((exercise) => [exercise.id, exercise.name])).toEqual([
      ['e1', 'Đẩy tạ đơn 1'],
      ['e2', 'Kéo tạ đơn 1'],
      ['e3', 'Gập tạ đơn 1'],
    ]);
  });
});
