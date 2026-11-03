import { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import { useDebounce } from '../../hooks/useDebounce';
import { ExerciseRow } from './ExerciseRow';
import type { Exercise } from '../../types';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<string>('default');

  const debouncedSearch = useDebounce<string>(searchTerm, 300);

  // Lọc và sắp xếp với useMemo
  const filteredExercises = useMemo<Exercise[]>(() => {
    let result = EXERCISES.filter((ex: Exercise) => {
      const matchSearch = ex.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                          ex.trainer.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchGroup = selectedGroup === 'Tất cả' || ex.group === selectedGroup;
      return matchSearch && matchGroup;
    });

    if (sortBy === 'name-asc') {
      result = [...result].sort((a: Exercise, b: Exercise) => a.name.localeCompare(b.name, 'vi'));
    } else if (sortBy === 'duration-asc') {
      result = [...result].sort((a: Exercise, b: Exercise) => a.duration - b.duration);
    }

    return result;
  }, [debouncedSearch, selectedGroup, sortBy]);

  // Bổ sung lấy hàm addToSession từ useSessionStore
  const addToSession = useSessionStore((s) => s.addToSession);

  const handleAddToSession = useCallback((exercise: Exercise) => {
    addToSession(exercise);
  }, [addToSession]);
  const startSession = useSessionStore((s) => s.startSession);
  const savedIds = useSavedStore((s) => s.ids);
  const toggleSave = useSavedStore((s) => s.toggle);

  const handleStart = useCallback((exercise: Exercise) => {
    const index = filteredExercises.findIndex((e: Exercise) => e.id === exercise.id);
    startSession(filteredExercises, index >= 0 ? index : 0);
  }, [filteredExercises, startSession]);

  const handleToggleSave = useCallback((id: string) => {
    toggleSave(id);
  }, [toggleSave]);

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
        Kho 10.000 Bài Tập Gym
      </h1>
      
      {/* Bộ lọc và Tìm kiếm */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tìm kiếm</label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            placeholder="Tên bài hoặc HLV..."
            style={{ width: '240px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Nhóm cơ</label>
          <select 
            value={selectedGroup}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGroup(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            {GROUPS.map((g: string) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Sắp xếp</label>
          <select 
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="duration-asc">Thời lượng tăng dần</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '8px', fontSize: '14px', color: '#4b5563' }}>
        {filteredExercises.length > 0 ? `Tìm thấy ${filteredExercises.length} bài tập` : 'Không tìm thấy bài tập nào'}
      </div>

      {/* Danh sách ảo hóa bằng react-window */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', overflow: 'hidden' }}>
        {filteredExercises.length > 0 ? (
          <List
            height={560}
            itemCount={filteredExercises.length}
            itemSize={56}
            width="100%"
          >
            {({ index, style }: { index: number; style: React.CSSProperties }) => (
              <ExerciseRow
                key={filteredExercises[index].id}
                exercise={filteredExercises[index]}
                index={index}
                style={style}
                onStart={handleStart}
                onAddToSession={handleAddToSession}
                onToggleSave={handleToggleSave}
                isSaved={savedIds.includes(filteredExercises[index].id)}
              />
            )}
          </List>
        ) : (
          <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            Không tìm thấy bài tập nào
          </div>
        )}
      </div>
    </div>
  );
}