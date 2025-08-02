import React, { useState } from "react";
import AssetModal from "./AssetModal.jsx"; // Reutilizamos el AssetModal existente
import { watermark } from "../assetsData.js";

const DashboardAssetsModal = ({ assets, onClose, assetsCatalog = [] }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showIndividualModal, setShowIndividualModal] = useState(false);

  // Función para obtener los assets completos desde el catálogo
  const getAssetsFromIds = (assetIds) => {
    if (!Array.isArray(assetIds) || !Array.isArray(assetsCatalog)) {
      return [];
    }
    
    return assetIds
      .map(id => assetsCatalog.find(asset => asset.id === id))
      .filter(asset => asset !== undefined); // Filtrar assets no encontrados
  };

  // Determinar si 'assets' son IDs o assets completos
  const assetsToShow = Array.isArray(assets) && assets.length > 0
    ? (typeof assets[0] === 'string' ? getAssetsFromIds(assets) : assets)
    : [];

  // Verificar si tenemos assets para mostrar
  if (!assetsToShow || assetsToShow.length === 0) {
    console.log("AssetsModal: No valid assets to display", { assets, assetsCatalog });
  }

  console.log("AssetsModal opened with assets:", assetsToShow);

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    setShowIndividualModal(true);
  };

  const handleCloseIndividualModal = () => {
    setShowIndividualModal(false);
    setSelectedAsset(null);
  };

  const getAssetIcon = (asset) => {
    const isImage = asset.tipo ? asset.tipo.includes("image") : asset.type?.startsWith("image/");
    const isVideo = asset.tipo ? asset.tipo.includes("video") : asset.type?.startsWith("video/");
    const isAudio = asset.tipo ? asset.tipo.includes("audio") : asset.type?.startsWith("audio/");
    
    if (isImage) return "🖼️";
    if (isVideo) return "🎬";
    if (isAudio) return "🎵";
    return "📄";
  };

  return (
    <>
      {/* Modal principal con lista de assets */}
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" 
        onClick={onClose}
      >
        <div
          className="relative bg-bg text-white max-w-[90vw] max-h-[90vh] w-[800px] rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex bg-orange items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-3xl font-bold font-bebas">
              ARCHIVOS SOLICITADOS ({assetsToShow.length})
            </h2>
            <button
              onClick={onClose}
              className="text-white text-xl hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {assetsToShow.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-white/70 text-xl">No se encontraron archivos</p>
                <p className="text-white/50 text-sm mt-2">
                  {assets && assets.length > 0 
                    ? "Los archivos solicitados no están disponibles en el catálogo" 
                    : "No hay archivos para mostrar"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4" 
                   style={{ 
                     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                   }}>
                {assetsToShow.map((asset, index) => (
                  <div
                    key={`${asset.id}-${index}`}
                    className="bg-black/30 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-200 hover:scale-105 cursor-pointer group"
                    onClick={() => handleAssetClick(asset)}
                  >
                    {/* Preview del asset */}
                    <div className="relative h-32 bg-black/50 flex items-center justify-center">
                      {asset.url && asset.tipo?.includes("image") ? (
                        <div className="relative w-full h-full">
                          <img
                            src={asset.url}
                            alt={asset.titulo}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error("Error loading image:", asset.url);
                              e.target.style.display = 'none';
                            }}
                          />
                          {/* Watermark overlay si existe */}
                          {watermark && (
                            <img
                              src={watermark}
                              alt="Watermark"
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="text-4xl">
                          {getAssetIcon(asset)}
                        </div>
                      )}
                      
                      {/* Overlay con efecto hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white font-bold">👁️ Ver detalles</span>
                      </div>
                    </div>

                    {/* Info del asset */}
                    <div className="p-4">
                      <h3 className="font-bold text-white text-lg font-adi mb-1 truncate">
                        {asset.titulo || "Sin título"}
                      </h3>
                      <p className="text-white/70 text-sm mb-2">
                        {asset.tipo || asset.type || "Tipo desconocido"}
                      </p>
                      {asset.dimensions && (
                        <p className="text-white/60 text-xs mb-1">
                          {asset.dimensions}
                        </p>
                      )}
                      {asset.size && (
                        <p className="text-white/60 text-xs">
                          {(asset.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-orange border-t border-white/20 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 font-adi font-bold"
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>

      {/* Modal individual para asset seleccionado (reutiliza AssetModal existente) */}
      {showIndividualModal && selectedAsset && (
        <AssetModal 
          asset={selectedAsset} 
          onClose={handleCloseIndividualModal} 
        />
      )}
    </>
  );
};

export default DashboardAssetsModal;