import { useState, useEffect, useRef } from "react";
import RequestForm from "./RequestForm.jsx";
import Button from "../Button.jsx";

export default function RequestPopup({
  selectedAssets,
  onClose,
  onRemoveAsset,
  onSubmit,
  cartButtonRef
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);

  // ✅ Animación de entrada
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // ✅ Calcular posición relativa al botón del carrito
  useEffect(() => {
    const updatePosition = () => {
      if (cartButtonRef?.current) {
        const buttonRect = cartButtonRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Posicionar el popup arriba y a la izquierda del botón
        const popupWidth = 650;
        const popupHeight = 600;
        
        // Calcular posición arriba y a la izquierda del botón
        let newTop = buttonRect.top - popupHeight - 20; // 20px de separación
        let newLeft = buttonRect.left - popupWidth - 20; // 20px de separación
        
        // Ajustar si se sale de la pantalla por arriba
        if (newTop < 20) {
          newTop = 20;
        }
        
        // Ajustar si se sale de la pantalla por la izquierda
        if (newLeft < 20) {
          newLeft = 20;
        }
        
        // Ajustar si se sale de la pantalla por la derecha
        if (newLeft + popupWidth > windowWidth - 20) {
          newLeft = windowWidth - popupWidth - 20;
        }
        
        setPosition({
          top: newTop,
          left: newLeft,
        });
      } else {
        // Fallback: centrar en pantalla si no hay referencia del botón
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        setPosition({
          top: Math.max(20, (windowHeight - 600) / 2),
          left: Math.max(20, (windowWidth - 650) / 2),
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [cartButtonRef]);

  const handleFinalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // ✅ Mostrar confirmación exitosa sin alert
      setShowConfirmation(true);
      setShowRequestForm(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      // ✅ También mostrar error en el popup en lugar de alert
      alert("❌ Error sending request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (selectedAssets.length === 0) {
      alert("No tienes assets seleccionados");
      return;
    }
    setShowRequestForm(true);
  };

  const handleGoBack = () => {
    setShowRequestForm(false);
    setShowConfirmation(false);
  };

  const handleCloseWithAnimation = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // ✅ Vista de confirmación mejorada
  const renderConfirmationView = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
        {/* Icono de éxito animado */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-pulse" 
               style={{ backgroundColor: '#10B981' }}>
            <span className="text-4xl">✓</span>
          </div>
          {/* Círculos decorativos */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-bounce"
               style={{ backgroundColor: 'var(--color-orange)' }}></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full animate-bounce delay-150"
               style={{ backgroundColor: 'var(--color-orange)', opacity: 0.7 }}></div>
        </div>

        <h2 className="text-4xl font-bold mb-4" 
            style={{ color: 'var(--color-white)', fontFamily: 'var(--font-bebas)' }}>
          REQUEST SENT SUCCESSFULLY!
        </h2>
        
        <p className="text-xl leading-relaxed mb-4" 
           style={{ color: 'var(--color-white)', opacity: 0.9 }}>
          Your request has been submitted successfully.
        </p>
        
        <p className="text-lg leading-relaxed mb-8 color-white opacity-70" >
          Our team will review your request and contact you soon.
        </p>

      </div>
      
      <div className="p-6 border-t border-orange flex justify-center ">
        <Button
          text="✓ CLOSE"
          filled={false}
          onClick={handleCloseWithAnimation}
          className="w-full max-w-sm mx-auto mt-4"
        />

      </div>
    </div>
  );

  // ✅ Vista del carrito mejorada con altura fija
  const renderCartView = () => (
    <div className="flex flex-col h-full">
      {/* Header fijo */}
      <div className="flex items-center justify-between p-6 border-b border-orange-500/20 flex-shrink-0">
        <h2 className="text-3xl font-bold flex items-center gap-3" 
            style={{ color: 'var(--color-white)', fontFamily: 'var(--font-bebas)' }}>
          🛒 TU SELECCIÓN
        </h2>
        <button
          onClick={handleCloseWithAnimation}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
          style={{ 
            color: 'var(--color-white)', 
            backgroundColor: 'rgba(255, 157, 0, 0.1)',
            border: '2px solid var(--color-orange)'
          }}
        >
          <span className="text-xl font-bold">✕</span>
        </button>
      </div>

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          {selectedAssets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(255, 157, 0, 0.1)' }}>
                <span className="text-4xl">🛒</span>
              </div>
              <p className="text-xl" style={{ color: 'var(--color-white)', opacity: 0.7 }}>
                No has seleccionado ningún asset
              </p>
            </div>
          ) : (
            <>
              {/* ✅ Assets grid mejorada para evitar glitches */}
              <div className="mb-6">
                <div className="grid gap-4" 
                     style={{ 
                       gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                       minHeight: 'fit-content'
                     }}>
                  {selectedAssets.map((asset, index) => (
                    <div
                      key={`${asset.id}-${index}`} // ✅ Key más estable para evitar glitches
                      className="relative rounded-xl overflow-hidden backdrop-blur-sm border-2 transition-all duration-200 hover:scale-105 group"
                      style={{ 
                        backgroundColor: 'rgba(255, 157, 0, 0.1)',
                        borderColor: 'var(--color-orange)',
                        minHeight: '120px' // ✅ Altura mínima fija
                      }}
                    >
                      {/* Imagen del asset */}
                      {asset.url && asset.tipo?.includes("image") ? (
                        <img
                          src={asset.url}
                          alt={asset.titulo}
                          className="w-full h-24 object-cover"
                          loading="lazy" // ✅ Lazy loading para mejor performance
                        />
                      ) : (
                        <div className="w-full h-24 flex items-center justify-center text-3xl"
                             style={{ backgroundColor: 'rgba(242, 242, 242, 0.1)' }}>
                          {asset.tipo?.includes("image") ? "🖼️" : 
                           asset.tipo?.includes("video") ? "🎬" : 
                           asset.tipo?.includes("audio") ? "🎵" : "📄"}
                        </div>
                      )}
                      
                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2"
                           style={{ backgroundColor: 'var(--color-orange)' }}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate" 
                               style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-adi)' }}>
                              {asset.titulo || "Sin nombre"}
                            </p>
                            <p className="text-xs opacity-80" style={{ color: 'var(--color-bg)' }}>
                              {asset.type}
                            </p>
                          </div>
                          {/* ✅ Botón de eliminar mejorado */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemoveAsset(asset.id);
                            }}
                            className="ml-2 p-1 rounded-full transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                            style={{ 
                              backgroundColor: 'rgba(255, 174, 0, 0.8)',
                              color: 'white'
                            }}
                            title="Eliminar asset"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información de resumen */}
              <div className="mb-6 p-4 rounded-xl border-2" 
                   style={{ 
                     backgroundColor: 'rgba(255, 157, 0, 0.1)',
                     borderColor: 'var(--color-orange)'
                   }}>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold" style={{ color: 'var(--color-white)', fontFamily: 'var(--font-adi)' }}>
                    {selectedAssets.length} ASSETS SELECCIONADOS
                  </span>
                  <span className="text-lg font-bold" style={{ color: 'var(--color-orange)', fontFamily: 'var(--font-adi)' }}>
                    LISTOS PARA SOLICITAR
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer fijo con botones */}
      <div className="p-6 border-t border-orange-500/20 flex-shrink-0">
        <div className="flex gap-10 justify-between">
          <Button text="← GO BACK" filled={false} onClick={handleCloseWithAnimation} />

          <Button
            text="CONTINUE →"
            filled={true}
            onClick={handleContinue}
            disabled={selectedAssets.length === 0}
          />

        </div>
      </div>
    </div>
  );
  // ✅ Vista del formulario con scroll
  const renderFormView = () => (
    <div className="flex flex-col h-full">
      {/* Header fijo */}
      <div className="flex items-center justify-between p-6 border-b border-orange-500/20 flex-shrink-0">
        <button
          onClick={handleGoBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
          style={{ 
            color: 'var(--color-orange)',
            backgroundColor: 'rgba(255, 157, 0, 0.1)',
            fontFamily: 'var(--font-adi)',
            fontWeight: 'bold'
          }}
        >
          ← VOLVER AL CARRITO
        </button>
        <button
          onClick={handleCloseWithAnimation}
          disabled={isSubmitting}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50"
          style={{ 
            color: 'var(--color-white)', 
            backgroundColor: 'rgba(255, 157, 0, 0.1)',
            border: '2px solid var(--color-orange)'
          }}
        >
          <span className="text-xl font-bold">✕</span>
        </button>
      </div>

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <RequestForm
            assets={selectedAssets}
            onBack={handleGoBack}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay de fondo con animación */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleCloseWithAnimation}
      />
      
      {/* ✅ Popup con tamaño fijo y posición centrada */}
      <div
        ref={popupRef}
        className={`fixed z-50 rounded-xl shadow-2xl border transition-all duration-300 ${
          isVisible 
            ? 'opacity-100 transform translate-y-0 scale-100' 
            : 'opacity-0 transform translate-y-4 scale-95'
        }`}
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-orange)',
          borderWidth: '2px',
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: '650px', // ✅ Ancho fijo
          height: '600px', // ✅ Altura fija
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 40px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showConfirmation 
          ? renderConfirmationView()
          : showRequestForm 
          ? renderFormView() 
          : renderCartView()
        }
      </div>

      {/* ✅ Estilos de scroll personalizados */}
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
    </>
  );
}