import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Layout from "./components/layouts/Layout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* nested protected pages go here, e.g. */}
          {/* <Route index element={<Dashboard />} /> */}
        </Route>
         <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
