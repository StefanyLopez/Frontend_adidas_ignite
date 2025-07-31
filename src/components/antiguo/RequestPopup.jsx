// import { useState } from "react";
// import RequestForm from "./RequestForm";
// import SelectionCart from "./SelectionCart";

// // Componente de popup para solicitud de medios con 2 pasos
// export default function RequestPopup({ 
//   selectedAssets,  // Archivos seleccionados
//   onClose,        // Función para cerrar popup
//   onRemoveAsset,  // Función para eliminar archivos
//   onSubmit        // Función para enviar solicitud
// }) {
//   // Estado para controlar el paso actual (1 o 2)
//   const [step, setStep] = useState(1);

//   // Funciones para navegar entre pasos
//   const handleNext = () => setStep(2);  // Avanzar al paso 2
//   const handleBack = () => setStep(1);  // Volver al paso 1

//   // Maneja el envío final del formulario
//   const handleFinalSubmit = (formData) => {
//     onSubmit(formData);  // Pasa los datos al componente padre
//   };

//   return (
//     <div className="popup-overlay">
//       <div className="popup-container">
//         {/* Botón para cerrar el popup */}
//         <button className="close-btn" onClick={onClose}>✖</button>

//         {/* Paso 1: Carrito de selección */}
//         {step === 1 ? (
//           <SelectionCart
//             assets={selectedAssets}
//             onRemoveAsset={onRemoveAsset}  // Eliminar archivos
//             onContinue={handleNext}  // Continuar al siguiente paso
//           />
//         ) : (
//           /* Paso 2: Formulario de solicitud */
//           <RequestForm
//             assets={selectedAssets}
//             onBack={handleBack}  // Volver al paso anterior
//             onSubmit={handleFinalSubmit}  // Enviar formulario
//           />
//         )}
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import SelectionCart from "./SelectionCart";
import RequestForm from "./RequestForm";
import styles from "./RequestPopup.module.css";

export default function RequestPopup({
  selectedAssets,
  onClose,
  onRemoveAsset,
  onSubmit
}) {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleFinalSubmit = (formData) => onSubmit(formData);

  return (
    <div
      className={styles.popupOverlay}
      onClick={onClose}             // clic fuera cierra
    >
      <div
        className={styles.popupContainer}
        onClick={(e) => e.stopPropagation()} // evita cierre al click interno
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
        >
          ✖
        </button>

        {step === 1 ? (
          <SelectionCart
            assets={selectedAssets}
            onRemoveAsset={onRemoveAsset}
            onContinue={handleNext}
          />
        ) : (
          <RequestForm
            assets={selectedAssets}
            onBack={handleBack}
            onSubmit={handleFinalSubmit}
          />
        )}
      </div>
    </div>
  );
}
