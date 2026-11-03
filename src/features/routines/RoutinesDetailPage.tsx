import { Link, useParams } from 'react-router-dom';
import { EXERCISES } from '../../data/exercises';
import { formatDuration } from '../../utils/format';
import { useSessionStore } from '../session/useSessionStore';
import { useRoutineDispatch, useRoutines } from './RoutineHooks';

const exercisesById = new Map(EXERCISES.map((exercise) => [exercise.id, exercise]));

export default function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore((state) => state.startSession);

  const routine = routines.find((item) => item.id === id);
  if (!routine) return <p>Không tìm thấy giáo án</p>;

  const exercises = routine.exerciseIds.flatMap((exerciseId) => {
    const exercise = exercisesById.get(exerciseId);
    return exercise ? [exercise] : [];
  });
  const totalSeconds = exercises.reduce((total, exercise) => total + exercise.duration, 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <main className="saved-page" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/routines">Quay lại danh sách giáo án</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-h)' }}>
        {routine.name}
      </h1>
      <p>Tổng thời gian: {minutes} phút {seconds} giây</p>
      <button
        type="button"
        onClick={() => startSession(exercises, 0)}
        disabled={exercises.length === 0}
      >
        Tập tất cả
      </button>
      {exercises.length === 0 ? (
        <p>Giáo án chưa có bài tập nào.</p>
      ) : (
        <ul style={{ padding: 0, margin: '16px 0 0', listStyle: 'none', border: '1px solid var(--surface-border)', borderRadius: '6px' }}>
          {exercises.map((exercise) => (
            <li
              key={exercise.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 16px', borderBottom: '1px solid var(--surface-border)' }}
            >
              <span>{exercise.name} — HLV {exercise.trainer} · {exercise.group} · {formatDuration(exercise.duration)}</span>
              <button
                type="button"
                onClick={() => dispatch({ type: 'removeExercise', routineId: routine.id, exerciseId: exercise.id })}
              >
                Bỏ
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}