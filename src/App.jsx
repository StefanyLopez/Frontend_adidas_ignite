import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";

function App() {
  return (
    // Configure application routes
    <BrowserRouter>
      <Routes>
        {/* Main Route - Displays the home page */}
        <Route path="/" element={<HomePage />} />

        {/* Login Path - Displays the Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Path - Displays the admin page */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
