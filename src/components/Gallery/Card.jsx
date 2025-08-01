import { useState, useEffect } from "react";
import { watermark } from "../../assetsData.js";
import { MediaService } from "../../utilities/mediaService.jsx";

const Card = ({ asset, selectedIds, onSelect, onOpenModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedIds.includes(asset.id);

  // Función para manejar la selección
  const handleSelect = () => {
    console.log("Card clicked, asset:", asset); // Debug
    onSelect(asset); // Pasar el objeto completo del asset
  };

  return (
    <div
      className={`relative w-full max-w-[400px] min-w-[300px] overflow-visible transition-all duration-300 ${
        isSelected ? "ring-4 ring-orange rounded-xl" : ""
      }`}
      onClick={handleSelect} 
    >
      <div
        className="w-full aspect-square cursor-pointer transition-transform duration-300 ease-out transform origin-center"
        style={{
          transform: isHovered ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0px)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
          {asset.tipo.includes("image") && asset.url && (
            <img
              src={asset.url}
              alt={asset.titulo}
              className="w-full h-full object-cover"
              onError={() => console.error("Error al cargar imagen:", asset.url)}
            />
          )}

          {asset.tipo.includes("video") && asset.url && (
            <video
              controls
              className="w-full h-full object-cover"
              onError={() => console.error("Error al cargar video:", asset.url)}
            >
              <source src={asset.url} type="video/mp4" />
              Your browser does not support HTML5 videos.
            </video>
          )}

          {asset.tipo.includes("audio") && asset.url && (
            <div className="relative w-full h-full">
              <img
                src={"/default-audio.jpg"}
                alt="Audio Preview"
                className="w-full h-full object-cover"
              />
              <audio
                controls
                className="absolute bottom-0 left-0 w-full bg-black/80"
              >
                <source src={asset.url} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {watermark && (
            <img
              src={watermark}
              alt="Watermark"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
            />
          )}

          <div
            className="absolute inset-0 transition-colors duration-300 z-20"
            style={{
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
            }}
          />

          {/* Indicador de selección */}
          <div
            className={`absolute top-2 right-2 w-6 h-6 rounded-full transition-all duration-300 z-30 flex items-center justify-center ${
              isSelected 
                ? 'bg-orange-500 opacity-100 scale-110' 
                : isHovered 
                ? 'bg-orange-500/70 opacity-100' 
                : 'bg-orange-500/50 opacity-0'
            }`}
          >
            {isSelected && (
              <span className="text-white text-sm font-bold">✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Panel de información responsivo */}
      <div
        className="absolute left-0 right-0  rounded-b-xl  overflow-hidden transition-all duration-500 ease-out z-40"
        style={{
          top: '100%',
          height: isHovered ? '180px' : '0px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0px)' : 'translateY(-10px)',
          backgroundImage: "url(/HoverCard.png)",
          backgroundSize: 'cover',
          backgroundPosition: 'center top 180px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-3 sm:p-4 border-t-2 border-orange-400 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-x-12 items-center text-white text-center">
          {/* Título */}
          <div className="flex flex-col justify-center">
            <h3 className="font-adi text-lg sm:text-xl lg:text-2xl">{asset.titulo}</h3>
          </div>

          {/* Info del archivo - oculto en móvil */}
          <div className="hidden sm:flex flex-col justify-center">
            <p className="text-base sm:text-lg lg:text-2xl">{asset.type}</p>
            <p className="text-sm">{asset.dimensions}</p>
            <p className="text-sm">{asset.size}</p>
          </div>

          {/* Botón de preview */}
          <div className="flex justify-center relative">
            <button
              className="flex flex-col items-center justify-center w-[70px] h-[40px] sm:w-[94px] sm:h-[54px] rounded-lg transition-all duration-200 transform bg-orange hover:scale-110"
              onClick={(e) => {
                e.stopPropagation(); // Evitar que se seleccione la card
                console.log("Preview button clicked for asset:", asset);
                onOpenModal?.(asset);
              }}
            >
              <img
                src="/Preview_icon.png"
                alt="Preview Icon"
                className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mb-1"
              />
              <span className="text-white text-xs sm:text-sm lg:text-base font-adi">Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;