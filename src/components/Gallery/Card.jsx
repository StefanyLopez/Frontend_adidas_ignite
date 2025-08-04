import { useState } from "react";
import { watermark } from "../../assetsData.js";

/**
 * Card Component - Displays individual media assets with hover effects and selection functionality
 * @param {Object} asset - The media asset object containing id, title, type, url, etc.
 * @param {Array} selectedIds - Array of currently selected asset IDs
 * @param {Function} onSelect - Callback function when card is selected/clicked
 * @param {Function} onOpenModal - Callback function to open preview modal
 */
const Card = ({ asset, selectedIds, onSelect, onOpenModal }) => {
  // State to track hover status for animations and info panel display
  const [isHovered, setIsHovered] = useState(false);

  // Check if current asset is selected by comparing with selected IDs array
  const isSelected = selectedIds.includes(asset.id);

  /**Handle card selection - passes complete asset object to parent component*/
  const handleSelect = () => {
    console.log("Card clicked, asset:", asset); // Debug log
    onSelect(asset); // Pass the complete asset object to parent
  };

  return (
    <div
      className={`relative w-full max-w-[400px] min-w-[300px] overflow-visible transition-all duration-300 ${
        isSelected ? "ring-4 ring-orange rounded-xl" : ""
      }`}
      onClick={handleSelect}
    >
      {/* Main card container with hover animations */}
      <div
        className="w-full aspect-square cursor-pointer transition-transform duration-300 ease-out transform origin-center"
        style={{
          // Scale and lift effect on hover
          transform: isHovered
            ? "scale(1.05) translateY(-10px)"
            : "scale(1) translateY(0px)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Asset display container */}
        <div className="relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
          {/* Image asset rendering */}
          {asset.tipo.includes("image") && asset.url && (
            <img
              src={asset.url}
              alt={asset.titulo}
              className="w-full h-full object-cover"
              onError={() => console.error("Error loading image:", asset.url)}
            />
          )}

          {/* Video asset rendering with HTML5 controls */}
          {asset.tipo.includes("video") && asset.url && (
            <video
              controls
              className="w-full h-full object-cover"
              onError={() => console.error("Error loading video:", asset.url)}
            >
              <source src={asset.url} type="video/mp4" />
              Your browser does not support HTML5 videos.
            </video>
          )}

          {/* Audio asset rendering with default cover image and controls */}
          {asset.tipo.includes("audio") && asset.url && (
            <div className="relative w-full h-full">
              {/* Default audio cover image */}
              <img
                src={"/default-audio.jpg"}
                alt="Audio Preview"
                className="w-full h-full object-cover"
              />
              {/* Audio controls overlay */}
              <audio
                controls
                className="absolute bottom-0 left-0 w-full bg-black/80"
              >
                <source src={asset.url} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {/* Watermark overlay - displayed on all assets if available */}
          {watermark && (
            <img
              src={watermark}
              alt="Watermark"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
            />
          )}

          {/* Hover overlay - dark semi-transparent layer */}
          <div
            className="absolute inset-0 transition-colors duration-300 z-20"
            style={{
              backgroundColor: isHovered ? "rgba(0, 0, 0, 0.2)" : "transparent",
            }}
          />

          {/* Selection indicator - checkmark in top-right corner */}
          <div
            className={`absolute top-2 right-2 w-6 h-6 rounded-full transition-all duration-300 z-30 flex items-center justify-center ${
              isSelected
                ? "bg-orange opacity-100 scale-110" // Selected state: visible with checkmark
                : isHovered
                ? "bg-orange/70 opacity-100" // Hovered state: semi-transparent
                : "bg-orange/50 opacity-0" // Default state: hidden
            }`}
          >
            {/* Checkmark icon for selected state */}
            {isSelected && (
              <span className="text-white text-sm font-bold">✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Responsive information panel - slides down on hover */}
      <div
        className="absolute left-0 right-0 overflow-hidden transition-all duration-500 ease-out z-40"
        style={{
          top: "100%",
          height: isHovered ? "180px" : "0px", // Expand/collapse height
          opacity: isHovered ? 1 : 0, // Fade in/out
          transform: isHovered ? "translateY(0px)" : "translateY(-10px)", // Slide animation
          backgroundImage: "url(/HoverCard.png)", // Background image
          backgroundSize: "cover",
          backgroundPosition: "center top 180px",
        }}
        // Keep panel open when hovering over it
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Information grid layout - responsive columns */}
        <div className="p-3 sm:p-4 border-t-2 border-orange-400 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-x-12 items-center text-white text-center">
          {/* Asset title section */}
          <div className="flex flex-col justify-center">
            <h3 className="font-adi text-sm ">
              {asset.titulo}
            </h3>
          </div>

          {/* File information section */}
          <div className="hidden sm:flex flex-col justify-center">
            <p className="text-lg sm:text-sm lg:text-lg">{asset.type}</p>{" "}
            {/* File type */}
            <p className="text-sm">{asset.dimensions}</p> {/* Dimensions */}
            <p className="text-sm">{asset.size}</p> {/* File size */}
          </div>

          {/* Preview button section */}
          <div className="flex justify-center relative">
            <button
              className="flex flex-col items-center justify-center w-[70px] h-[40px] sm:w-[94px] sm:h-[54px] rounded-lg transition-all duration-200 transform bg-orange hover:scale-110"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card selection when clicking preview
                console.log("Preview button clicked for asset:", asset);
                onOpenModal?.(asset); // Open preview modal if callback exists
              }}
            >
              {/* Preview icon */}
              <img
                src="/Preview_icon.png"
                alt="Preview Icon"
                className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mb-1"
              />
              {/* Preview button label */}
              <span className="text-white text-xs sm:text-sm lg:text-base font-adi">
                Preview
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
