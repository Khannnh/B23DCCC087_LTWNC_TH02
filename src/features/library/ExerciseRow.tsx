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
    <div style={style} className="flex items-center justify-between px-4 border-b border-gray-200 hover:bg-gray-50 text-sm">
      <div className="flex items-center space-x-4">
        <span className="w-10 text-gray-400">{index + 1}</span>
        <div>
          <span className="font-medium text-gray-800">{exercise.name}</span>
          <span className="ml-2 text-xs text-gray-500">({exercise.group})</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <span className="text-gray-600">HLV: {exercise.trainer}</span>
        <span className="text-gray-600 w-16 text-right">{formatDuration(exercise.duration)}</span>
        <div className="space-x-2">
          <button 
            onClick={() => onStart(exercise)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
          >
            Bắt đầu
          </button>
          <button 
            onClick={() => onToggleSave(exercise.id)}
            className="px-2 py-1 border rounded text-xs"
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
});

ExerciseRow.displayName = 'ExerciseRow';