const BUILD_TAG = "wk-5182";

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import SessionBar, { SESSION_BAR_HEIGHT } from './features/session/SessionBar';
import { useTheme } from './contexts/ThemeHooks';

const SavedPage = lazy(() => import('./features/saved/SavedPage'));
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'));
const RoutinesDetailPage = lazy(() => import('./features/routines/RoutinesDetailPage'));

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className="app-shell" data-build-tag={BUILD_TAG} style={{ minHeight: '100vh', backgroundColor: 'var(--app-bg)', paddingBottom: SESSION_BAR_HEIGHT }}>
        {/* Thanh menu điều hướng đầu trang */}
        <nav className="app-nav" style={{ display: 'flex', gap: '24px', padding: '16px 24px', backgroundColor: 'var(--surface-bg)', borderBottom: '1px solid var(--surface-border)', marginBottom: '16px' }}>
          <NavLink 
            to="/" 
            style={({ isActive }) => ({ 
              textDecoration: 'none', 
              color: isActive ? 'var(--accent)' : 'var(--text)',
              fontWeight: isActive ? 'bold' : 'normal',
              borderBottom: isActive ? '2px solid #2563eb' : 'none',
              paddingBottom: '4px'
            })}
          >
            Kho bài tập
          </NavLink>
          <NavLink 
            to="/saved" 
            style={({ isActive }) => ({ 
              textDecoration: 'none', 
              color: isActive ? 'var(--accent)' : 'var(--text)',
              fontWeight: isActive ? 'bold' : 'normal',
              borderBottom: isActive ? '2px solid #2563eb' : 'none',
              paddingBottom: '4px'
            })}
          >
            Bài tập đã lưu
          </NavLink>
          <NavLink 
            to="/routines" 
            style={({ isActive }) => ({ 
              textDecoration: 'none', 
              color: isActive ? 'var(--accent)' : 'var(--text)',
              fontWeight: isActive ? 'bold' : 'normal',
              borderBottom: isActive ? '2px solid #2563eb' : 'none',
              paddingBottom: '4px'
            })}
          >
            Danh sách giáo án
          </NavLink>
          <button type="button" onClick={toggleTheme}>
            {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
          </button>
        </nav>

        {/* Khung chứa các Route */}
        <Suspense fallback={<p>Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutinesDetailPage />} />
          </Routes>
        </Suspense>
      </div>
      <SessionBar />
    </Router>
  );
}