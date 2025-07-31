import styles from "./LoginAdminModal.module.css";
import { useNavigate } from "react-router-dom";

const LoginAdminModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Acceso administrativo</h2>
        <input type="text" placeholder="Correo" className={styles.input} />
        <input type="password" placeholder="Contraseña" className={styles.input} />
        <button
          className={styles.signInBtn}
          onClick={() => navigate("/admin")}
        >
          Sign In
        </button>
        <button className={styles.closeBtn} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default LoginAdminModal;
