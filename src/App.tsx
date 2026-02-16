import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/shared/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/layouts/AdminLayout';
import { TrainerLayout } from './components/layouts/TrainerLayout';
import { MemberLayout } from './components/layouts/MemberLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MembersManagement } from './pages/MembersManagement';

// New Imports - Admin Pages
import { MembershipsManagement } from './pages/MembershipsManagement';
import { PaymentsManagement } from './pages/PaymentsManagement';
import { AttendanceManagement } from './pages/AttendanceManagement';

// New Imports - Trainer Pages
import { WorkoutPlansManagement } from './pages/WorkoutPlansManagement';

// New Imports - Member Pages
import { MemberPayment } from './pages/MemberPayment';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Dashboard (has its own navbar) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes - Wrapped in AdminLayout */}
            <Route
              path="/members"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <MembersManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/memberships"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <MembershipsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <PaymentsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <AttendanceManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Trainer Routes - Wrapped in TrainerLayout */}
            <Route
              path="/workout-plans"
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <TrainerLayout>
                    <WorkoutPlansManagement />
                  </TrainerLayout>
                </ProtectedRoute>
              }
            />

            {/* Member Routes - Wrapped in MemberLayout */}
            <Route
              path="/my-payments"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <MemberLayout>
                    <MemberPayment />
                  </MemberLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;