import { useMemo } from 'react';
import { EXERCISES } from '../../data/exercises';
import { useSavedStore } from './useSavedStore';
import { useSessionStore } from '../session/useSessionStore';
import { formatDuration } from '../../utils/format';
import type { Exercise } from '../../types';

const exercisesById = new Map<string, Exercise>(
  EXERCISES.map((exercise) => [exercise.id, exercise] as const),
);

export default function SavedPage() {
  const ids = useSavedStore((state) => state.ids);
  const toggleSaved = useSavedStore((state) => state.toggle);
  const startSession = useSessionStore((state) => state.startSession);

  const savedExercises = useMemo(
    () => ids.flatMap((id) => {
      const exercise = exercisesById.get(id);
      return exercise ? [exercise] : [];
    }),
    [ids],
  );

  return (
    <main style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
        Bài tập đã lưu
      </h1>
      <button
        type="button"
        onClick={() => startSession(savedExercises, 0)}
        disabled={savedExercises.length === 0}
        style={{
          padding: '8px 14px',
          marginBottom: '16px',
          background: savedExercises.length > 0 ? '#2563eb' : '#9ca3af',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: savedExercises.length > 0 ? 'pointer' : 'not-allowed',
        }}
      >
        Tập tất cả
      </button>
      {savedExercises.length === 0 ? (
        <p>Bạn chưa lưu bài tập nào.</p>
      ) : (
        <ul style={{ padding: 0, margin: 0, listStyle: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff' }}>
          {savedExercises.map((exercise) => (
            <li
              key={exercise.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}
            >
              <div>
                <strong>{exercise.name}</strong>
                <span> — HLV {exercise.trainer} · {exercise.group} · {formatDuration(exercise.duration)}</span>
              </div>
              <button
                type="button"
                aria-label="Bỏ lưu"
                onClick={() => toggleSaved(exercise.id)}
                style={{ padding: '6px 10px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                Bỏ lưu
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}