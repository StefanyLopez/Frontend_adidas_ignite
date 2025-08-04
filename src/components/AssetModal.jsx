import React from "react";
import { watermark } from "../assetsData.js";

/**
 * AssetModal - Full-screen modal for asset preview and details
 * @param {Object} asset - Asset object to display
 * @param {Function} onClose - Close modal callback
 */
const AssetModal = ({ asset, onClose }) => {
  // Early return if no asset provided
  if (!asset) {
    console.error("AssetModal: No asset provided");
    return null;
  }

  console.log("AssetModal opened with asset:", asset); // Debug

  // Determine media type based on asset properties
  const isImage = asset.tipo
    ? asset.tipo.includes("image")
    : asset.type?.startsWith("image/");
  const isVideo = asset.tipo
    ? asset.tipo.includes("video")
    : asset.type?.startsWith("video/");
  const isAudio = asset.tipo
    ? asset.tipo.includes("audio")
    : asset.type?.startsWith("audio/");

  /**
   * Format file size from bytes to readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size string
   */
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(2)} MB`;
  };

  /**
   * Get appropriate icon based on file type
   * @returns {string} Emoji icon for file type
   */

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "#171717d8" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col lg:flex-row max-w-[95vw] max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white text-xl z-50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          ✕
        </button>

        {/* Media section - left side */}
        <div className="bg-bg flex items-center justify-center p-6 lg:p-8 rounded-l-3xl relative min-h-[50vh] lg:min-h-[70vh] lg:min-w-[60vw]">
          {/* Responsive background image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/loginbg.png"
              alt="Background decoration"
              className="w-80 h-20 sm:w-96 md:w-450 md:h-100 object-contain filter "
            />
          </div>

          {/* Image rendering */}
          {isImage && asset.url && (
            <div className="relative">
              <img
                src={asset.url}
                alt={asset.titulo || "Image"}
                className="max-h-[60vh] lg:max-h-[70vh] max-w-[80vw] lg:max-w-[50vw] object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  console.error("Error loading image:", asset.url);
                  e.target.src = "/default-image.jpg";
                }}
              />
              {/* Watermark overlay for images */}
              {watermark && (
                <img
                  src={watermark}
                  alt="Watermark"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-lg"
                />
              )}
            </div>
          )}

          {/* Video rendering */}
          {isVideo && asset.url && (
            <div className="relative">
              <video
                src={asset.url}
                controls
                className="max-h-[60vh] lg:max-h-[70vh] max-w-[80vw] lg:max-w-[50vw] object-contain rounded-lg shadow-2xl"
                onError={() => console.error("Error loading video:", asset.url)}
              />
              {/* Watermark overlay for videos */}
              {watermark && (
                <img
                  src={watermark}
                  alt="Watermark"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-lg"
                />
              )}
            </div>
          )}

          {/* Audio rendering with circular display */}
          {isAudio && (
            <div className="flex flex-col items-center relative">
              <div className="relative mb-6">
                <div className="w-64 h-64 bg-gradient-to-br from-orange to-orange/70 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-6xl">🎵</span>
                </div>
                {/* Watermark overlay for audio */}
                {watermark && (
                  <img
                    src={watermark}
                    alt="Watermark"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-full"
                  />
                )}
              </div>
              {/* Audio controls */}
              {asset.url && (
                <audio
                  controls
                  className="w-full max-w-md bg-black/30 rounded-full backdrop-blur-sm"
                >
                  <source src={asset.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}

          {/* Fallback for unsupported file types */}
          {!isImage && !isVideo && !isAudio && (
            <div className="text-white text-center p-12">
              <div className="text-8xl mb-4">📄</div>
              <p className="text-xl mb-2">
                File type not supported for preview
              </p>
              <p className="text-sm text-gray-300">
                Type: {asset.tipo || asset.type || "Unknown"}
              </p>
            </div>
          )}
        </div>

        {/* Information panel - right side */}
        <div className="bg-bg backdrop-blur-sm p-8 lg:p-10 flex flex-col justify-center gap-6 lg:w-[400px] rounded-r-3xl border-l border-white/10">
          {/* Header with title */}
          <div className="text-center border-b border-white/20 pb-6">
            <h2 className="text-3xl font-bold font-bebas text-orange tracking-wider">
              Data {asset.titulo || "Untitled"}
            </h2>
          </div>

          {/* Information cards */}
          <div className="space-y-4">
            {/* File type card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">TYPE</span>
              </div>
              <p className="text-white font-adi mt-1 text-lg">
                {asset.tipo || asset.type || "Unknown type"}
              </p>
            </div>

            {/* Dimensions card */}
            {asset.dimensions && (
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange rounded-full"></div>
                  <span className="text-gray-300 text-sm font-medium">
                    DIMENSIONS
                  </span>
                </div>
                <p className="text-white font-adi mt-1 text-lg">
                  {asset.dimensions}
                </p>
              </div>
            )}

            {/* File size card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">SIZE</span>
              </div>
              <p className="text-white font-adi mt-1 text-lg">
                {formatFileSize(asset.size)}
              </p>
            </div>

            {/* URL card */}
            {asset.url && (
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange rounded-full"></div>
                  <span className="text-gray-300 text-sm font-medium">
                    LOCATION
                  </span>
                </div>
                <p className="text-white/70 font-adi mt-1 text-sm break-all leading-relaxed">
                  {asset.url}
                </p>
              </div>
            )}
          </div>

          {/* Footer with logo */}
          <div className="text-center pt-6 border-t border-white/20">
            <img
              src="../logos/adidas.png"
              alt="Logo"
              className="h-8 object-contain mx-auto opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Additional CSS styles for backdrop blur */}
      <style jsx>{`
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
};

export default AssetModal;
