import React from "react";

/**
 * SelectionCart - Modal cart displaying selected assets with management options
 * @param {Array} assets - Array of selected asset objects
 * @param {Function} onRemoveAsset - Callback to remove asset from cart
 * @param {Function} onContinue - Callback to proceed with request
 * @param {Function} onClose - Callback to close cart modal
 */
const SelectionCart = ({ assets, onRemoveAsset, onContinue, onClose }) => {
  
  /**
   * Calculate total size of all selected assets
   * @returns {number} Total size in bytes
   */
  const getTotalSize = () => {
    return assets.reduce((total, asset) => total + (asset.size || 0), 0);
  };

  /**
   * Format bytes to human readable file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size string (B, KB, MB, GB)
   */
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  /**
   * Get appropriate icon based on asset type
   * @param {string} tipo - Asset type string
   * @returns {string} Emoji icon for asset type
   */
  const getAssetIcon = (tipo) => {
    const type = (tipo || "").toLowerCase();
    if (type.includes("image")) return "🖼️";
    if (type.includes("video")) return "🎬";
    if (type.includes("audio")) return "🎵";
    return "📄";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
        
        {/* Cart header with title and asset count */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🛒 Your Selection
            <span className="bg-orange text-white text-sm px-2 py-1 rounded-full">
              {assets.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {assets.length === 0 ? (
            // Empty cart state
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🛒</div>
                <p>You haven't selected any assets</p>
                <p className="text-sm mt-1">Click on images to add them</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable assets list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {assets.map((item) => {
                  // Extract asset display info with fallbacks
                  const name = item.titulo || item.name || "Unnamed file";
                  const size = item.size ? formatSize(item.size) : "Unknown size";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Asset thumbnail */}
                      <div className="flex-shrink-0">
                        {item.url && item.tipo?.includes("image") ? (
                          <img
                            src={item.url}
                            alt={name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          // Icon fallback for non-images
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xl">
                            {getAssetIcon(item.tipo)}
                          </div>
                        )}
                      </div>

                      {/* Asset information */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">
                          {name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.tipo || "Unknown type"} • {size}
                        </p>
                      </div>

                      {/* Remove from cart button */}
                      <button
                        onClick={() => onRemoveAsset(item.id)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="Remove from cart"
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer with statistics and action buttons */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                {/* Cart statistics */}
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span>Total: {assets.length} assets</span>
                  <span>Size: {formatSize(getTotalSize())}</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue Selecting
                  </button>
                  <button
                    onClick={onContinue}
                    className="flex-1 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Request Assets →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectionCart;