import React, { useState } from "react";
import AssetModal from "./AssetModal.jsx"; // Reuse existing AssetModal
import { watermark } from "../assetsData.js";

/**
 * DashboardAssetsModal - Grid modal displaying multiple requested assets
 * @param {Array} assets - Array of asset IDs or complete asset objects
 * @param {Function} onClose - Close modal callback
 * @param {Array} assetsCatalog - Complete catalog to lookup assets by ID
 */
const DashboardAssetsModal = ({ assets, onClose, assetsCatalog = [] }) => {
  // State for individual asset preview modal
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showIndividualModal, setShowIndividualModal] = useState(false);

  /**
   * Get complete asset objects from IDs using catalog lookup
   * @param {Array} assetIds - Array of asset IDs
   * @returns {Array} Array of complete asset objects
   */
  const getAssetsFromIds = (assetIds) => {
    if (!Array.isArray(assetIds) || !Array.isArray(assetsCatalog)) {
      return [];
    }
    
    return assetIds
      .map(id => assetsCatalog.find(asset => asset.id === id))
      .filter(asset => asset !== undefined); // Filter out not found assets
  };

  // Determine if 'assets' are IDs or complete objects
  const assetsToShow = Array.isArray(assets) && assets.length > 0
    ? (typeof assets[0] === 'string' ? getAssetsFromIds(assets) : assets)
    : [];

  // Validate assets to display
  if (!assetsToShow || assetsToShow.length === 0) {
    console.log("AssetsModal: No valid assets to display", { assets, assetsCatalog });
  }

  console.log("AssetsModal opened with assets:", assetsToShow);

  /**
   * Handle asset card click to open individual preview
   * @param {Object} asset - Selected asset object
   */
  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    setShowIndividualModal(true);
  };

  /**
   * Close individual asset preview modal
   */
  const handleCloseIndividualModal = () => {
    setShowIndividualModal(false);
    setSelectedAsset(null);
  };

  /**
   * Get appropriate icon based on asset type
   * @param {Object} asset - Asset object
   * @returns {string} Emoji icon for asset type
   */
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
      {/* Global scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ff9d00 rgba(255, 157, 0, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          margin: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ff9d00 0%, #e69500 100%);
          border-radius: 6px;
          border: 2px solid transparent;
          background-clip: content-box;
          transition: all 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ffb333 0%, #ff9d00 100%);
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Enhanced scrollbar visibility for Firefox */
        @supports (scrollbar-width: thin) {
          .custom-scrollbar {
            scrollbar-width: auto;
            scrollbar-color: #ff9d00 rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>

      {/* Main modal with assets grid */}
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" 
        onClick={onClose}
      >
        <div
          className="relative bg-bg text-white max-w-[90vw] max-h-[90vh] w-[800px] rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex bg-orange items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-3xl font-bold font-bebas">
              REQUESTED FILES ({assetsToShow.length})
            </h2>
            <button
              onClick={onClose}
              className="text-white text-xl hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="custom-scrollbar p-6 max-h-[70vh] overflow-y-auto">
            {assetsToShow.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-white/70 text-xl">No files found</p>
                <p className="text-white/50 text-sm mt-2">
                  {assets && assets.length > 0 
                    ? "The requested files are not available in the catalog" 
                    : "No files to display"}
                </p>
              </div>
            ) : (
              // Assets grid
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
                    {/* Asset preview */}
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
                          {/* Watermark overlay */}
                          {watermark && (
                            <img
                              src={watermark}
                              alt="Watermark"
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                          )}
                        </div>
                      ) : (
                        // Icon fallback for non-images
                        <div className="text-4xl">
                          {getAssetIcon(asset)}
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white font-bold">👁️ View details</span>
                      </div>
                    </div>

                    {/* Asset information */}
                    <div className="p-4">
                      <h3 className="font-bold text-white text-lg font-adi mb-1 truncate">
                        {asset.titulo || "Untitled"}
                      </h3>
                      <p className="text-white/70 text-sm mb-2">
                        {asset.tipo || asset.type || "Unknown type"}
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

            {/* Show total assets */}
            {assetsToShow.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-white/30 text-sm">
                  {assetsToShow.length} file{assetsToShow.length !== 1 ? 's' : ''} total
                </p>
              </div>
            )}
          </div>

          {/* Modal footer */}
          <div className="p-6 bg-orange border-t border-bg text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 font-adi font-bold"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>

      {/* Individual asset preview modal */}
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