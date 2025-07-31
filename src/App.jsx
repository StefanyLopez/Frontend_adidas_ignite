import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    // Configura las rutas de la aplicación
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - Muestra la página de inicio */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta de administración - Muestra el panel de admin */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
