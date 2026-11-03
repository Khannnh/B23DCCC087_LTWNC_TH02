import React from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  style: React.CSSProperties;
  onStart: (exercise: Exercise) => void;
  onAddToSession: (exercise: Exercise) => void;
  onAddToRoutine: (exerciseId: string) => void;
  addToRoutineDisabled: boolean;
  addToRoutineTitle?: string;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
}

export const ExerciseRow = React.memo(({ exercise, index, style, onStart, onAddToSession, onAddToRoutine, addToRoutineDisabled, addToRoutineTitle, onToggleSave, isSaved }: ExerciseRowProps) => {
  return (
    <div className="exercise-row" style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', background: '#fff', boxSizing: 'border-box' }}>
      {/* Cột trái: Số thứ tự, tên bài, nhóm cơ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden', flex: 1 }}>
        <span style={{ width: '30px', color: '#6b7280', fontWeight: 500, flexShrink: 0 }}>{index + 1}</span>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-h)' }}>{exercise.name}</span>
          <span className="exercise-metadata" style={{ marginLeft: '8px', fontSize: '13px', color: '#4b5563' }}>({exercise.group})</span>
        </div>
      </div>

      {/* Cột phải: HLV, thời lượng và các nút bấm gần nhau */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, marginLeft: '16px' }}>
        <span style={{ color: '#4b5563', fontSize: '13px' }}>HLV: {exercise.trainer}</span>
        <span style={{ color: '#4b5563', width: '45px', textAlign: 'right', fontSize: '13px', fontWeight: 500 }}>{formatDuration(exercise.duration)}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onStart(exercise)}
            style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            Bắt đầu
          </button>
          <button 
            onClick={() => onAddToSession(exercise)}
            style={{ padding: '6px 10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
            title="Thêm vào buổi tập"
          >
            + Buổi tập
          </button>
          <button
            onClick={() => onAddToRoutine(exercise.id)}
            disabled={addToRoutineDisabled}
            title={addToRoutineTitle}
            style={{ padding: '6px 10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: addToRoutineDisabled ? 'not-allowed' : 'pointer', opacity: addToRoutineDisabled ? 0.5 : 1, fontSize: '13px', fontWeight: 500 }}
          >
            + Giáo án
          </button>
          <button 
            onClick={() => onToggleSave(exercise.id)}
            aria-label={isSaved ? "Bỏ lưu" : "Lưu bài tập"}
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: isSaved ? '#ca8a04' : '#9ca3af' }}
          >
            {isSaved ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
});

ExerciseRow.displayName = 'ExerciseRow';