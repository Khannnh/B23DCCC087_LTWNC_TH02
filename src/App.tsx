const BUILD_TAG = "wk-5182";

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import SessionBar, { SESSION_BAR_HEIGHT } from './features/session/SessionBar';

const SavedPage = lazy(() => import('./features/saved/SavedPage'));

// Tạm thời comment lại các trang chưa viết xong để tránh lỗi import
// import RoutinesPage from './features/routines/RoutinesPage';
// import RoutinesDetailPage from './features/routines/RoutinesDetailPage';

export default function App() {
  return (
    <Router>
      <div data-build-tag={BUILD_TAG} style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: SESSION_BAR_HEIGHT }}>
        {/* Thanh menu điều hướng đầu trang */}
        <nav style={{ display: 'flex', gap: '24px', padding: '16px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
          <NavLink 
            to="/" 
            style={({ isActive }) => ({ 
              textDecoration: 'none', 
              color: isActive ? '#2563eb' : '#4b5563', 
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
              color: isActive ? '#2563eb' : '#4b5563', 
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
              color: isActive ? '#2563eb' : '#4b5563', 
              fontWeight: isActive ? 'bold' : 'normal',
              borderBottom: isActive ? '2px solid #2563eb' : 'none',
              paddingBottom: '4px'
            })}
          >
            Danh sách giáo án
          </NavLink>
        </nav>

        {/* Khung chứa các Route */}
        <Suspense fallback={<p>Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            {/* <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutinesDetailPage />} /> */}
          </Routes>
        </Suspense>
      </div>
      <SessionBar />
    </Router>
  );
}