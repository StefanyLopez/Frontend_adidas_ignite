import { useState } from "react";
import Button from "../Button.jsx";

// Componente para formulario de solicitud de medios
export default function RequestForm({ assets = [], onBack, onSubmit, isSubmitting = false }) {
  const [datos, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
    deadline: "",
  });

  const [errors, setErrors] = useState({});

  // Fecha de hoy en formato YYYY-MM-DD
  const hoy = new Date().toISOString().split("T")[0];

  // Validar campo individual
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'El nombre es requerido';
        } else if (value.trim().length < 2) {
          newErrors.name = 'El nombre debe tener al menos 2 caracteres';
        } else {
          delete newErrors.name;
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Ingresa un email válido';
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'purpose':
        if (!value.trim()) {
          newErrors.purpose = 'El propósito es requerido';
        } else if (value.trim().length < 10) {
          newErrors.purpose = 'Describe el propósito con más detalle (mín. 10 caracteres)';
        } else {
          delete newErrors.purpose;
        }
        break;
      
      case 'deadline':
        if (!value) {
          newErrors.deadline = 'La fecha límite es requerida';
        } else if (value < hoy) {
          newErrors.deadline = 'La fecha no puede ser anterior a hoy';
        } else {
          delete newErrors.deadline;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Maneja cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación en tiempo real para fecha
    if (name === "deadline" && value < hoy) {
      setFormData((prev) => ({ ...prev, deadline: hoy }));
      validateField(name, hoy);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validar campo en tiempo real
    if (value) {
      validateField(name, value);
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos
    Object.keys(datos).forEach(key => {
      validateField(key, datos[key]);
    });

    // Verificar si hay errores
    const hasErrors = Object.keys(errors).length > 0 || 
                     !datos.name || !datos.email || !datos.purpose || !datos.deadline;

    if (hasErrors) {
      return;
    }

    onSubmit({
      ...datos,
      assetsCount: assets.length,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-lg mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-adi mb-2 flex items-center gap-2 color-white font-bebas">
              📋 COMPLETA TU SOLICITUD
            </h2>
            <p className="text-base color-white opacity-70 font-adi">
              Solicita {assets.length} asset{assets.length !== 1 ? 's' : ''} seleccionado{assets.length !== 1 ? 's' : ''}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block font-adi text-sm color-white">NOMBRE COMPLETO *</label>
              <input
                type="text"
                name="name"
                value={datos.name}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Ingresa tu nombre completo"
                className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed color-white font-adi ${errors.name ? 'border-red-500' : 'border-orange-500'} bg-orange/10`}
                required
              />
              {errors.name && (
                <p className="text-red-400 text-sm flex items-center gap-1 font-adi">
                  <span>⚠️</span> {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-adi text-sm color-white">CORREO ELECTRÓNICO *</label>
              <input
                type="email"
                name="email"
                value={datos.email}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="ejemplo@correo.com"
                className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed color-white font-adi ${errors.email ? 'border-red-500' : 'border-orange-500'} bg-orange/10`}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1 font-adi">
                  <span>⚠️</span> {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-adi text-sm color-white">PROPÓSITO DEL USO *</label>
              <textarea
                name="purpose"
                value={datos.purpose}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Describe cómo planeas usar estos assets..."
                rows={3}
                maxLength={500}
                className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all duration-200 resize-none focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed color-white font-adi ${errors.purpose ? 'border-red-500' : 'border-orange-500'} bg-orange/10`}
                required
              />
              {errors.purpose && (
                <p className="text-red-400 text-sm flex items-center gap-1 font-adi">
                  <span>⚠️</span> {errors.purpose}
                </p>
              )}
              <p className="text-xs color-white opacity-60 font-adi">
                {datos.purpose.length}/500 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-adi text-sm color-white">FECHA LÍMITE *</label>
              <input
                type="date"
                name="deadline"
                value={datos.deadline}
                onChange={handleChange}
                disabled={isSubmitting}
                min={hoy}
                className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed color-white font-adi ${errors.deadline ? 'border-red-500' : 'border-orange-500'} bg-orange/10`}
                required
              />
              {errors.deadline && (
                <p className="text-red-400 text-sm flex items-center gap-1 font-adi">
                  <span>⚠️</span> {errors.deadline}
                </p>
              )}
              <p className="text-xs color-white opacity-60 font-adi">
                Fecha mínima: {new Date(hoy).toLocaleDateString('es-ES')}
              </p>
            </div>

            <div className="p-4 rounded-xl border-2 border-orange-500 bg-orange/10">
              <h3 className="font-bold mb-3 text-base color-white font-adi">📊 RESUMEN DE TU SOLICITUD:</h3>
              <ul className="space-y-1 text-sm color-white opacity-80 font-adi">
                <li>• {assets.length} asset{assets.length !== 1 ? 's' : ''} seleccionado{assets.length !== 1 ? 's' : ''}</li>
                <li>• Solicitante: {datos.name || 'Por completar'}</li>
                <li>• Fecha límite: {datos.deadline ? new Date(datos.deadline).toLocaleDateString('es-ES') : 'Por seleccionar'}</li>
              </ul>
            </div>

            <p className="text-xs text-center leading-relaxed pt-2 color-white opacity-60 font-adi">
              Al enviar esta solicitud, confirmas que la información proporcionada es correcta 
              y que usarás los assets de acuerdo con los términos de uso.
            </p>
          </form>
        </div>
      </div>

      <div className="p-6 border-t border-orange-500/20 flex-shrink-0">
        <div className="flex gap-10 justify-between">
          <Button 
            text="← GO BACK" 
            filled={false} 
            onClick={onBack}
            disabled={isSubmitting}
          />

          <Button
            text={isSubmitting ? "SENDING..." : "SEND →"}
            filled={true}
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(errors).length > 0 || !datos.name || !datos.email || !datos.purpose || !datos.deadline}
          />
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--color-orange) rgba(255, 157, 0, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 157, 0, 0.1);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-orange);
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e69500;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
}