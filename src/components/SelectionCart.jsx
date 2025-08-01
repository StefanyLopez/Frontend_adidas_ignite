import React from "react";

const SelectionCart = ({ assets, onRemoveAsset, onContinue, onClose }) => {
  const getTotalSize = () => {
    return assets.reduce((total, asset) => total + (asset.size || 0), 0);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🛒 Tu Selección
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

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {assets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🛒</div>
                <p>No has seleccionado ningún asset</p>
                <p className="text-sm mt-1">Haz clic en las imágenes para añadirlas</p>
              </div>
            </div>
          ) : (
            <>
              {/* Lista de assets */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {assets.map((item) => {
                  const nombre = item.titulo || item.name || "Archivo sin nombre";
                  const size = item.size ? formatSize(item.size) : "Tamaño desconocido";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {item.url && item.tipo?.includes("image") ? (
                          <img
                            src={item.url}
                            alt={nombre}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xl">
                            {getAssetIcon(item.tipo)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">
                          {nombre}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.tipo || "Tipo desconocido"} • {size}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => onRemoveAsset(item.id)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="Eliminar del carrito"
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer con estadísticas */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span>Total: {assets.length} assets</span>
                  <span>Tamaño: {formatSize(getTotalSize())}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Seguir Seleccionando
                  </button>
                  <button
                    onClick={onContinue}
                    className="flex-1 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Solicitar Assets →
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