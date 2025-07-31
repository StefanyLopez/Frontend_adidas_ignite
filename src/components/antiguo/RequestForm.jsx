import { useState } from "react";

// Componente para formulario de solicitud de medios
export default function RequestForm({ assets = [], onBack, onSubmit }) {
  const [datos, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
    deadline: "",
  });

  // Fecha de hoy en formato YYYY-MM-DD
  const hoy = new Date().toISOString().split("T")[0];

  // Maneja cambios en los inputs del formulario
  const handleChange = (e) => {
  const { name, value } = e.target;

  // Validación directa sin instanciar Date para evitar desfases
  if (name === "deadline" && value < hoy) {
    alert("La fecha límite no puede ser anterior a hoy.");
    setFormData((prev) => ({ ...prev, deadline: hoy }));
    return;
  }

  setFormData((prev) => ({ ...prev, [name]: value }));
};



  // Maneja el envío del formulario
  const handleSubmit = (e) => {
  e.preventDefault();

  // Validación simple sin manipular Date
  if (datos.deadline < hoy) {
    alert("La fecha límite no puede ser anterior a hoy.");
    return;
  }

  // Validación de campos requeridos
  if (!datos.name || !datos.email || !datos.purpose || !datos.deadline) {
    alert("Por favor completa todos los campos");
    return;
  }

  onSubmit({
    ...datos,
    assetsCount: assets.length,
  });
};


  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <h2>📋 Completa tu solicitud</h2>

      {/* Campo para nombre */}
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={datos.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Campo para email */}
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={datos.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Campo para propósito */}
      <div className="form-group">
        <label>Propósito:</label>
        <textarea
          name="purpose"
          value={datos.purpose}
          onChange={handleChange}
          required
        />
      </div>

      {/* Campo para fecha límite */}
      <div className="form-group">
        <label>Fecha límite:</label>
        <input
          type="date"
          name="deadline"
          value={datos.deadline}
          onChange={handleChange}
          required
          min={hoy}
        />
      </div>

      {/* Botones de acción */}
      <div className="form-actions">
        <button type="button" onClick={onBack}>
          ← Atrás
        </button>
        <button type="submit">Enviar Solicitud</button>
      </div>
    </form>
  );
}
