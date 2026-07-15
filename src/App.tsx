import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import { ApplicantList } from './features/applicants';
import { LoginForm, SignupForm } from './features/auth';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import OfficerDashboard from './pages/officer/OfficerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* admin routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/applicants" element={<ApplicantList />} />
        </Route>

        {/* student routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* officer routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
