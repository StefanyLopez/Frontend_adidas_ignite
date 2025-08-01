
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./antiguo/LoginAdminModal.module.css";

const LoginAdminModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleSignIn = async () => {
  if (!isValidEmail(email)) {
    alert("⚠️ Por favor ingresa un correo válido");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/test/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json(); // ✅ Usamos solo .json() para evitar errores

    if (response.ok) {
      navigate("/admin");
    } else if (response.status === 401) {
      alert("Usuario no autorizado. Verifica tus credenciales.");
    } else if (response.status === 404) {
      alert("Usuario no encontrado");
    } else if (response.status >= 500) {
      alert("Error del servidor. Intenta más tarde.");
    } else {
      // ✅ Capturamos mensaje de error si lo hay
      alert(`Error inesperado en login: ${data.message ?? "Sin mensaje"}`);
    }

    console.error("Login error:", data);
  } catch (error) {
    alert("No se pudo conectar con el servidor");
    console.error("Conexión fallida:", error);
  }
};



const handleCreateUser = async () => {
  if (!isValidEmail(email)) {
    alert("Por favor ingresa un correo válido");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/test/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const result = await response.json();
      alert("Usuario creado exitosamente");
      onClose();
    } else {
      const errorResult = await response.text();
      alert("Error al crear usuario");
      console.error("Error en creación:", errorResult);
    }
  } catch (error) {
    alert("Error de conexión con el servidor");
    console.error("Error en conexión:", error);
  }
};

  

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Botón X */}
        <button className={styles.closeXBtn} onClick={onClose}>
          ❌
        </button>

        <h2>Acceso administrativo</h2>

        <input
          type="text"
          placeholder="Correo"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.signInBtn} onClick={handleSignIn}>
          Sign In
        </button>

        <button className={styles.createBtn} onClick={handleCreateUser}>
          Create User
        </button>
      </div>
    </div>
  );
};

export default LoginAdminModal;
