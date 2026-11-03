import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRoutineDispatch, useRoutines } from './RoutineHooks';

interface RoutineFormProps {
  existingNames: string[];
}

function RoutineForm({ existingNames }: RoutineFormProps) {
  const dispatch = useRoutineDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Tên giáo án không được để trống');
      return;
    }

    if (existingNames.some((existingName) => existingName.toLocaleLowerCase() === trimmedName.toLocaleLowerCase())) {
      setError('Tên giáo án đã tồn tại');
      return;
    }

    dispatch({ type: 'create', id: Date.now().toString(), name: trimmedName });
    setName('');
    setError('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'end', gap: '12px', marginBottom: '24px' }}>
      <div>
        <label htmlFor="routine-name" style={{ display: 'block', marginBottom: '4px' }}>Tên giáo án</label>
        <input
          id="routine-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError('');
          }}
        />
        {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}
      </div>
      <button type="submit">Tạo</button>
    </form>
  );
}

function RoutineList() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();

  return (
    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
      {routines.map((routine) => (
        <li
          key={routine.id}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 16px', borderBottom: '1px solid var(--surface-border)' }}
        >
          <div>
            <strong>{routine.name}</strong>
            <span> · {routine.exerciseIds.length} bài</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to={`/routines/${routine.id}`}>Chi tiết</Link>
            <button type="button" onClick={() => dispatch({ type: 'remove', id: routine.id })}>
              Xóa
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function RoutinesPage() {
  const routines = useRoutines();

  return (
    <main className="saved-page" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-h)' }}>
        Danh sách giáo án
      </h1>
      <RoutineForm existingNames={routines.map((routine) => routine.name)} />
      <RoutineList />
    </main>
  );
}