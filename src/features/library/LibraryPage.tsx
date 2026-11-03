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

  // Lọc và sắp xếp với useMemo, tường minh kiểu cho ex
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kho 10.000 Bài Tập Gym</h1>
      
      {/* Bộ lọc và Tìm kiếm */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tìm kiếm</label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            placeholder="Tên bài hoặc HLV..."
            className="border px-3 py-2 rounded text-sm w-64"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Nhóm cơ</label>
          <select 
            value={selectedGroup}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGroup(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="Tất cả">Tất cả</option>
            {GROUPS.map((g: string) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Sắp xếp</label>
          <select 
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="duration-asc">Thời lượng tăng dần</option>
          </select>
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-600">
        {filteredExercises.length > 0 ? `Tìm thấy ${filteredExercises.length} bài tập` : 'Không tìm thấy bài tập nào'}
      </div>

      {/* Danh sách ảo hóa bằng react-window */}
      <div className="border rounded bg-white overflow-hidden">
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
                onToggleSave={handleToggleSave}
                isSaved={savedIds.includes(filteredExercises[index].id)}
              />
            )}
          </List>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400">Không tìm thấy bài tập nào</div>
        )}
      </div>
    </div>
  );
}