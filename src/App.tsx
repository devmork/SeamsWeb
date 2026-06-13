import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import QRScanner from "./pages/Officer/QRScanner";
import { StudentDashboard } from "./pages/StudentDashboard";
import { LoginForm } from "./pages/Auth/LoginForm";
import { SignupForm } from "./pages/Auth/SignupForm";
import RegisterPage from "./pages/Auth/RegisterPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/officer" element={<QRScanner />} />
          <Route
            path="/student"
            element={
              <StudentDashboard
                onLogout={function (): void {
                  throw new Error("Function not implemented.");
                }}
                isApproved={false}
              />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
