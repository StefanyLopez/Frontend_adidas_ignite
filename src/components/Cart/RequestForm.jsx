import { useState } from "react";
import Button from "../Button.jsx";

// Allows users to submit a request for selected assets
export default function RequestForm({ assets = [], onBack, onSubmit, isSubmitting = false }) {
  const [datos, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
    deadline: "",
  });

  const [errors, setErrors] = useState({});

  // Date validation yyyy-mm-dd format
  const hoy = new Date().toISOString().split("T")[0];

  // Validates each field in real-time
  const validateField = (name, value) => { 
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'purpose':
        if (!value.trim()) {
          newErrors.purpose = 'Purpose is required';
        } else if (value.trim().length < 10) {
          newErrors.purpose = 'Must be at least 10 characters';
        } else {
          delete newErrors.purpose;
        }
        break;
      
      case 'deadline':
        if (!value) {
          newErrors.deadline = 'Deadline is required';
        } else if (value < hoy) {
          newErrors.deadline = 'Deadline cannot be in the past';
        } else {
          delete newErrors.deadline;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Handles input changes and validates in real-time
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the deadline is set to a past date, reset it to today
    if (name === "deadline" && value < hoy) {
      setFormData((prev) => ({ ...prev, deadline: hoy }));
      validateField(name, hoy);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate the field in real-time
    if (value) {
      validateField(name, value);
    }
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(datos).forEach(key => {
      validateField(key, datos[key]);
    });

    // Check if there are any errors or if required fields are empty
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
              📋 COMPLETE YOUR REQUIREMENT
            </h2>
            <p className="text-base color-white opacity-70 font-adi">
              {/* Display the number of selected assets */}
              Request {assets.length} asset{assets.length !== 1 ? 's' : ''} selected {assets.length !== 1 ? 's' : ''}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block font-adi text-sm color-white">FULL NAME *</label>
              <input
                type="text"
                name="name"
                value={datos.name}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed color-white font-adi ${errors.name ? 'border-red-500' : 'border-orange-500'} bg-orange/10`}
                required
              />
              {errors.name && ( // Display error message if validation fails
                <p className="text-red-400 text-sm flex items-center gap-1 font-adi">
                  <span>⚠️</span> {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-adi text-sm color-white">EMAIL *</label>
              <input
                type="email"
                name="email"
                value={datos.email}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="example@correo.com" 
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
              <label className="block font-adi text-sm color-white">PURPOSE OF USE *</label>
              <textarea
                name="purpose"
                value={datos.purpose}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Describe how you plan to use these assets..."
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
              <label className="block font-adi text-sm color-white">DEADLINE *</label>
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
                Minimum date: {new Date(hoy).toLocaleDateString('es-ES')}
              </p>
            </div>

            <div className="p-4 rounded-xl border-2 border-orange-500 bg-orange/10">
              <h3 className="font-bold mb-3 text-base color-white font-adi">📊 SUMMARY OF YOUR APPLICATION:</h3>
              <ul className="space-y-1 text-sm color-white opacity-80 font-adi">
                <li>• {assets.length} asset{assets.length !== 1 ? 's' : ''} selected{assets.length !== 1 ? 's' : ''}</li>
                <li>• Applicant: {datos.name || 'Por completar'}</li>
                <li>• Deadline: {datos.deadline ? new Date(datos.deadline).toLocaleDateString('es-ES') : 'Por seleccionar'}</li>
              </ul>
            </div>

            <p className="text-xs text-center leading-relaxed pt-2 color-white opacity-60 font-adi">
              By submitting this application, you confirm that the information provided is accurate and that you will use the assets in accordance with the terms of use.
            </p>
          </form>
        </div>
      </div>

      { /* Footer with buttons */ }
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
            // Disable if submitting or if there are validation errors
            disabled={isSubmitting || Object.keys(errors).length > 0 || !datos.name || !datos.email || !datos.purpose || !datos.deadline}
          />
        </div>
      </div>

      { /* Styles for custom scrollbar */ }
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