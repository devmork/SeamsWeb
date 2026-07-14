import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/auth/LoginForm';
import SignupForm from './pages/auth/SignupForm';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* admin routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<AuthenticatedLayout />}>
          <Route path="/student/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<AuthenticatedLayout />}>
          <Route path="/officer/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
