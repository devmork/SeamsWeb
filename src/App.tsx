import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginForm } from './pages/Auth/LoginForm';
import SignupForm from './pages/Auth/SignupForm';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route element={<AuthenticatedLayout role="student" />}>
            <Route
              path="/admin/dashboard"
              element={<div>Admin Dashboard</div>}
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
