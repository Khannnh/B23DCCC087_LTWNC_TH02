import React from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  style: React.CSSProperties;
  onStart: (exercise: Exercise) => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
}

export const ExerciseRow = React.memo(({ exercise, index, style, onStart, onToggleSave, isSaved }: ExerciseRowProps) => {
  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderBottom: '1px solid #eee', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', flex: 1 }}>
        <span style={{ width: '24px', color: '#888', flexShrink: 0 }}>{index + 1}</span>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span style={{ fontWeight: 500, color: '#333' }}>{exercise.name}</span>
          <span style={{ marginLeft: '6px', fontSize: '11px', color: '#666' }}>({exercise.group})</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '12px' }}>
        <span style={{ color: '#555', fontSize: '12px' }}>HLV: {exercise.trainer}</span>
        <span style={{ color: '#555', width: '40px', textAlign: 'right', fontSize: '12px' }}>{formatDuration(exercise.duration)}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => onStart(exercise)}
            style={{ padding: '3px 8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
          >
            Bắt đầu
          </button>
          <button 
            onClick={() => onToggleSave(exercise.id)}
            style={{ padding: '3px 6px', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
});

ExerciseRow.displayName = 'ExerciseRow';