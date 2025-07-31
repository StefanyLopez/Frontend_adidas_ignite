import { use, useState, useEffect } from "react";
import { watermark } from "../../assetsData.js";
import { MediaService } from "../../utilities/mediaService.jsx";


const Card = ({ asset, selectedIds, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.log("Card mounted with asset:", asset);
  }, []);

  return (
    <div className="relative w-[484px] overflow-visible">
      <div
        className={`w-[484px] h-[484px] cursor-pointer transition-transform duration-300 ease-out transform origin-center`}
        style={{
          transform: isHovered ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0px)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect?.(asset)}
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
            Tu navegador no soporta videos HTML5.
          </video>
        )}

        {asset.tipo.includes("audio") && asset.url && (
          <div className="relative w-full h-full">
            <img
              src={"/default-audio-preview.jpg"} // o usa defaultimga si lo tienes como prop
              alt="Audio Preview"
              className="w-full h-full object-cover"
            />
            <audio
              controls
              className="absolute bottom-0 left-0 w-full bg-black/80"
            >
              <source src={asset.url} type="audio/mpeg" />
              Tu navegador no soporta audio HTML5.
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

          <div
            className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full transition-opacity duration-300 z-30"
            style={{ opacity: isHovered ? 1 : 0 }}
          />
        </div>
      </div>

      {/* Panel de información */}
      <div
        className="absolute left-0 right-0 top-[484px] bg-bg rounded-b-xl shadow-xl overflow-hidden transition-all duration-500 ease-out z-40"
        style={{
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
        <div className="p-4 border-t-2 border-orange-400 grid grid-cols-3 gap-x-12 items-center text-white text-center">
          <div className="flex flex-col justify-center">
            <h3 className="font-adi text-lg">{asset.titulo},{asset.size}</h3>
          </div>

          <div className="flex flex-col justify-center text-sm">
            <p>{asset.type}</p>
            <p>{asset.dimensions}</p>
          </div>

          <div className="flex justify-center relative">
            <button
              className="flex flex-col items-center justify-center w-[94px] h-[54px] rounded-lg transition-all duration-200 transform bg-orange hover:scale-110"
              onClick={() => console.log("¡Botón presionado!")}
            >
              <img
                src="/Preview_icon.png"
                alt="Preview Icon"
                className="w-8 h-8 mb-2"
              />
              <span className="text-white text-base font-adi">Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
