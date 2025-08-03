import { useState, useEffect, useRef } from "react";
import RequestForm from "./RequestForm.jsx";
import Button from "../Button.jsx";

// popup for requesting assets
export default function RequestPopup({
  selectedAssets,
  onClose,
  onRemoveAsset,
  onSubmit,
  cartButtonRef
}) {
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if the form is being submitted
  const [showRequestForm, setShowRequestForm] = useState(false); // State to toggle the request form view
  const [showConfirmation, setShowConfirmation] = useState(false); // State to toggle the confirmation view
  const [position, setPosition] = useState({ top: 0, right: 0 }); // Position of the popup
  const [isVisible, setIsVisible] = useState(false); // State to control visibility with animation
  const popupRef = useRef(null); // Reference to the popup element

  // Entrance animation effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate position of the popup based on the cart button
  useEffect(() => {
    const updatePosition = () => {
      if (cartButtonRef?.current) { // Check if the cart button reference is available
        const buttonRect = cartButtonRef.current.getBoundingClientRect(); // Get the position of the cart button
        const windowWidth = window.innerWidth; 
        
        // Define the size of the popup
        const popupWidth = 650;
        const popupHeight = 600;
        
        // Calculate the new position
        let newTop = buttonRect.top - popupHeight + 20 ;
        let newLeft = buttonRect.left - popupWidth + 20;
        
        // Adjust if the popup goes off-screen
        if (newTop < 20) {
          newTop = 20;
        }
        
        // Adjust if the popup goes off-screen on the left
        if (newLeft < 20) {
          newLeft = 20;
        }
        
        // Adjust if the popup goes off-screen on the right
        if (newLeft + popupWidth > windowWidth - 20) {
          newLeft = windowWidth - popupWidth - 20;
        }
        
        setPosition({
          top: newTop,
          left: newLeft,
        });
      } else {
        // Fallback position if the cart button is not available
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        setPosition({
          top: Math.max(20, (windowHeight - 600) / 2),
          left: Math.max(20, (windowWidth - 650) / 2),
        });
      }
    };
    // Update position on initial render and when the cart button reference changes
    updatePosition();
    window.addEventListener('resize', updatePosition); 
    return () => window.removeEventListener('resize', updatePosition);
  }, [cartButtonRef]);

  // Handle form submission
  const handleFinalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const requestData = {
        ...formData,
        assets: selectedAssets.map(asset => asset.id), // Convert selected assets to IDs
      };

      await onSubmit(requestData);
      // Show confirmation view after successful submission
      setShowConfirmation(true);
      setShowRequestForm(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      // Show error message to the user
      alert("❌ Error sending request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle buttons
  const handleContinue = () => {
    if (selectedAssets.length === 0) {
      alert("⚠️ Please select at least one asset to request.");
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

  // Render confirmation view
  const renderConfirmationView = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
        {/* Animated success icon*/}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-pulse" 
               style={{ backgroundColor: '#10B981' }}>
            <span className="text-4xl">✓</span>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-bounce" style={{ backgroundColor: '#10B981' }}></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full animate-bounce delay-150 opacity-70" style={{ backgroundColor: '#10B981' }} ></div>
        </div>

        <h2 className="text-4xl font-bebas mb-4 color-white">
          REQUEST SENT SUCCESSFULLY!
        </h2>
        
        <p className="text-xl font-adi leading-relaxed mb-4 color-orange opacity-90">
          Your request has been submitted successfully.
        </p>
        
        <p className="text-lg font-adi leading-relaxed mb-8 color-white opacity-70" >
          Our team will review your request and contact you soon.
        </p>

      </div>
      
      {/* Close button */}
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

  // Cart view 
  const renderCartView = () => (
    <div className="flex flex-col h-full">
      {/* Static Header */}
      <div className="flex items-center justify-between p-6 border-b border-orange flex-shrink-0">
        <h2 className="text-3xl font-bebas flex items-center gap-3 color-orange">
          🛒 YOUR SELECTION
        </h2>
        <button
          onClick={handleCloseWithAnimation}
          className="w-10 h-10 flex items-center justify-center border-2 border-orange rounded-full transition-all 
          duration-200 hover:scale-110 color-white bg-orange/10">
          <span className="text-xl font-bold">✕</span>
        </button>
      </div>

      {/* Scrollable content section  */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          {selectedAssets.length === 0 ? ( // Empty state when no assets are selected
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center color-orange/10">
                <span className="text-4xl">🛒</span>
              </div>
              <p className="text-xl font-adi leading-relaxed color-white opacity-70">
                You have not selected any assets
              </p>
            </div>
          ) : (
            <>
              {/* Assets grid display */}
              <div className="mb-6">
                <div 
                  className="grid gap-4" 
                  style={{ 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    minHeight: 'fit-content'
                  }}
                >
                  {selectedAssets.map((asset, index) => (
                    <div
                      key={asset.id}
                      className="relative rounded-xl overflow-hidden backdrop-blur-sm border-2 border-orange transition-all duration-200 hover:scale-105 group bg-orange/10"
                      style={{ 
                        minHeight: '120px'
                      }}
                    >
                      {/* Asset image */}
                      {asset.url && asset.tipo?.includes("image") ? (
                        <img
                          src={asset.url}
                          alt={asset.titulo}
                          className="w-full h-24 object-cover"
                          loading="lazy" // Lazy loading for better performance
                        />
                      ) : (
                        // Fallback icon based on asset type
                        <div className="w-full h-24 flex items-center justify-center text-3xl bg-gray-100/10">
                          {asset.tipo?.includes("image") ? "🖼️" : 
                          asset.tipo?.includes("video") ? "🎬" : 
                          asset.tipo?.includes("audio") ? "🎵" : "📄"}
                        </div>
                      )}
                      
                      {/* Asset info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-orange">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate text-bg font-adi">
                              {asset.titulo || "Untitled"}
                            </p>
                            <p className="text-xs opacity-80 text-bg">
                              {asset.type}
                            </p>
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemoveAsset(asset.id);
                            }}
                            className="ml-2 p-1 rounded-full transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 bg-orange/80 "
                            title="Remove asset"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary information */}
              <div className="mb-6 p-4 rounded-xl border-2 bg-orange/10 border-orange">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white font-adi">
                    {selectedAssets.length} SELECTED ASSETS
                  </span>
                  <span className="text-lg font-bold text-orange font-adi">
                    READY TO REQUEST
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="p-6 border-t border-orange-500/20 flex-shrink-0">
        <div className="flex gap-10 justify-between">
          <Button text="← GO BACK" onClick={handleCloseWithAnimation} />

          <Button
            text="CONTINUE →"
            onClick={handleContinue}
            disabled={selectedAssets.length === 0}
          />
        </div>
      </div>
      </div>
      );

      //  Form view with scroll functionality
      const renderFormView = () => (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-end p-6 border-b border-orange/20 flex-shrink-0">
          <button
            onClick={handleCloseWithAnimation}
            disabled={isSubmitting}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 text-white bg-orange/10 border-2 border-orange"
          >
            <span className="text-xl font-bold">✕</span>
          </button>
        </div>

        {/* Scrollable content */}
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
        {/* Background overlay with animation */}
        <div
          className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseWithAnimation}
        />
        
        {/* Popup with fixed size and centered position */}
        <div
          ref={popupRef}
          className={`fixed z-50 rounded-xl shadow-2xl border transition-all duration-300 bg-bg border-orange ${
            isVisible 
              ? 'opacity-100 transform translate-y-0 scale-100' 
              : 'opacity-0 transform translate-y-4 scale-95'
          }`}
          style={{
            borderWidth: '2px',
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: '650px',
            height: '600px', 
            maxWidth: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - 40px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Conditional rendering based on current view state */}
          {showConfirmation 
            ? renderConfirmationView()
            : showRequestForm 
            ? renderFormView() 
            : renderCartView()
          }
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
    </>
  );
}