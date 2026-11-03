import { useEffect } from 'react';
import { useSessionStore } from './useSessionStore';
import { CountdownBar } from './CountdownBar';

export default function SessionBar() {
  const queue = useSessionStore((s) => s.queue);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const isRunning = useSessionStore((s) => s.isRunning);
  const toggleRun = useSessionStore((s) => s.toggleRun);
  const next = useSessionStore((s) => s.next);
  const prev = useSessionStore((s) => s.prev);
  const tick = useSessionStore((s) => s.tick);

  // Đồng hồ đếm giây bằng setInterval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);
  const currentExercise = currentIndex >= 0 ? queue[currentIndex] : null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      zIndex: 1000,
      fontSize: '14px'
    }}>
      {/* Thông tin bài tập hiện tại */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '250px' }}>
        {currentExercise ? (
          <div>
            <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
              Đang tập: {currentExercise.name} – HLV {currentExercise.trainer}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Nhóm: {currentExercise.group}
            </div>
          </div>
        ) : (
          <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
            Chưa bắt đầu buổi tập
          </div>
        )}
      </div>

      {/* Thanh đếm ngược tiến trình */}
      {currentExercise && <CountdownBar />}

      {/* Các nút điều khiển */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={prev}
          style={{ padding: '6px 12px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
        >
          Trước
        </button>
        <button 
          onClick={toggleRun}
          disabled={currentIndex < 0}
          style={{ padding: '6px 16px', background: currentIndex >= 0 ? '#2563eb' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '4px', cursor: currentIndex >= 0 ? 'pointer' : 'not-allowed' }}
        >
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        </button>
        <button 
          onClick={next}
          style={{ padding: '6px 12px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
        >
          Sau
        </button>
        <div style={{ marginLeft: '16px', fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>
          Buổi tập: {queue.length} bài
        </div>
      </div>
    </div>
  );
}