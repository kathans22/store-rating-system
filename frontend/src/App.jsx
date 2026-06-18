import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, { GuestRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import UserStoresPage from './pages/UserStoresPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminAddUserPage from './pages/admin/AdminAddUserPage';
import AdminStoresPage from './pages/admin/AdminStoresPage';
import AdminAddStorePage from './pages/admin/AdminAddStorePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/password"
            element={
              <ProtectedRoute roles={['ADMIN', 'USER', 'STORE_OWNER']}>
                <UpdatePasswordPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminAddUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminUserDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminStoresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores/new"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminAddStorePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stores"
            element={
              <ProtectedRoute roles={['USER']}>
                <UserStoresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute roles={['STORE_OWNER']}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
