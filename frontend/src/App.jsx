import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

import DashboardPage from "./pages/dashboard";
import BMIPage from "./pages/BMIPage";
import SleepScorePage from "./pages/SleepScorePage";
import GHQtest from "./pages/QuizPage";
import FitLoginPage from "./pages/FitLoginPage";
import JurnalPage from "./pages/JurnalPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoPage from "./pages/TodoPage";
import ChataiPage from "./pages/ChataiPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyPage from "./pages/VerifyAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/BMI" element={<BMIPage />} />
          <Route path="/Sleep" element={<SleepScorePage />} />
          <Route path="/Jurnal" element={<JurnalPage />} />
          <Route path="/GHQtest" element={<GHQtest />} />
          <Route path="/Todo" element={<TodoPage />} />
          <Route path="/Chatwithai" element={<ChataiPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/signinfit" element={<FitLoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
