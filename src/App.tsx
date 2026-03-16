import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/Auth/LoginPage";
import RegisterPage from "./Pages/Auth/RegisterPage";
import QRScanner from "./Pages/Officer/QRScanner";
import { StudentDashboard } from "./Pages/StudentDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/officer" element={<QRScanner />} />
          <Route path="/student" element={<StudentDashboard onLogout={function (): void {
            throw new Error("Function not implemented.");
          } } isApproved={false} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
