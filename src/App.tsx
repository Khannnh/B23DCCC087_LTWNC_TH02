import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';

// Tạm thời comment lại các trang chưa viết xong để tránh lỗi import
// import SavedPage from './features/saved/SavedPage';
// import RoutinesPage from './features/routines/RoutinesPage';
// import RoutinesDetailPage from './features/routines/RoutinesDetailPage';

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '80px' }}>
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
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          {/* <Route path="/saved" element={<SavedPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/routines/:id" element={<RoutinesDetailPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}