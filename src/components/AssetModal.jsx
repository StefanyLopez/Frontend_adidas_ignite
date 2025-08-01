import React from "react";
import { watermark } from "../assetsData.js";

const AssetModal = ({ asset, onClose }) => {
  // Verificar si el asset existe
  if (!asset) {
    console.error("AssetModal: No asset provided");
    return null;
  }

  console.log("AssetModal opened with asset:", asset); // Debug

  // Determinar el tipo de media basado en las propiedades del asset
  const isImage = asset.tipo ? asset.tipo.includes("image") : asset.type?.startsWith("image/");
  const isVideo = asset.tipo ? asset.tipo.includes("video") : asset.type?.startsWith("video/");
  const isAudio = asset.tipo ? asset.tipo.includes("audio") : asset.type?.startsWith("audio/");

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div
        className="relative flex flex-col md:flex-row bg-orange text-white max-w-[90vw] max-h-[90vh] rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl z-50 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>

        {/* Fondo negro que se adapta */}
        <div className="bg-black flex items-center justify-center p-4 rounded-md relative">
          {isImage && asset.url && (
            <div className="relative">
              <img
                src={asset.url}
                alt={asset.titulo || "Image"}
                className="max-h-[80vh] max-w-[40vw] object-contain rounded-md"
                onError={(e) => {
                  console.error("Error loading image:", asset.url);
                  e.target.src = "/default-image.jpg"; // Fallback image
                }}
              />
              {/* Watermark overlay para imagen */}
              {watermark && (
                <img
                  src={watermark}
                  alt="Watermark"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-md"
                />
              )}
            </div>
          )}
          
          {isVideo && asset.url && (
            <div className="relative">
              <video
                src={asset.url}
                controls
                className="max-h-[80vh] max-w-[40vw] object-contain rounded-md"
                onError={() => console.error("Error loading video:", asset.url)}
              />
              {/* Watermark overlay para video */}
              {watermark && (
                <img
                  src={watermark}
                  alt="Watermark"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-md"
                />
              )}
            </div>
          )}
          
          {isAudio && (
            <div className="flex flex-col items-center relative">
              <div className="relative">
                <img
                  src="/default-audio.jpg"
                  alt="Audio Placeholder"
                  className="max-w-[40vw] max-h-[60vh] object-contain rounded-md mb-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {/* Watermark overlay para audio placeholder */}
                {watermark && (
                  <img
                    src={watermark}
                    alt="Watermark"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-md"
                  />
                )}
              </div>
              {asset.url && (
                <audio controls className="w-full bg-black">
                  <source src={asset.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}

          {/* Fallback si no se puede determinar el tipo */}
          {!isImage && !isVideo && !isAudio && (
            <div className="text-white text-center p-8">
              <p>Tipo de archivo no soportado para preview</p>
              <p className="text-sm text-gray-300 mt-2">
                Tipo: {asset.tipo || asset.type || "Desconocido"}
              </p>
            </div>
          )}
        </div>

        {/* Panel de detalles */}
        <div className="p-6 flex flex-col justify-center gap-2 w-[300px]">
          <h2 className="text-2xl font-bold font-adi">{asset.titulo || "Sin título"}</h2>
          <p className="text-white/80 text-sm">{asset.tipo || asset.type || "Tipo desconocido"}</p>
          <p className="text-white/80 text-sm">{asset.dimensions || "Sin dimensiones"}</p>
          <p className="text-white/80 text-sm">
            {asset.size ? `${(asset.size / 1024 / 1024).toFixed(2)} MB` : "Tamaño desconocido"}
          </p>
          {asset.url && (
            <p className="text-white/60 text-xs break-all mt-2">
              URL: {asset.url}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetModal;