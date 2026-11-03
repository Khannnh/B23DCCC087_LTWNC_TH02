import { useSessionStore } from './useSessionStore';
import { formatDuration } from '../../utils/format';

export function CountdownBar() {
  const queue = useSessionStore((s) => s.queue);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const elapsed = useSessionStore((s) => s.elapsed);

  if (currentIndex < 0 || !queue[currentIndex]) return null;

  const currentExercise = queue[currentIndex];
  const remaining = Math.max(0, currentExercise.duration - elapsed);
  const percent = Math.min(100, (elapsed / currentExercise.duration) * 100);

  return (
    <div style={{ flex: 1, maxWidth: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#4b5563' }}>
        <span>Còn lại: {formatDuration(remaining)}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.3s linear' }} />
      </div>
    </div>
  );
}