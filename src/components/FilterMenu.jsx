import { Search } from "lucide-react";

export default function FilterMenu({
  extensionFilter,
  setExtensionFilter,
  searchTerm,
  setSearchTerm,
}) {
  const handleFilterClick = (ext) => {
    setExtensionFilter(extensionFilter === ext ? null : ext);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full mt-6 md:mt-10 mb-6 md:mb-8 px-4 sm:px-8 lg:px-16">
      {/* Contenedor principal */}
      <div
        className="bg-orange rounded-lg px-4 sm:px-6 lg:px-12 py-4 flex flex-col lg:flex-row items-center justify-between text-white font-bold gap-6 lg:gap-4"
        style={{
          clipPath:
            "polygon(0 36%, 98.5% 0, 100% 100%, 2% 100%)",
        }}
      >
        {/* Filtros */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 lg:gap-8 font-adi text-base sm:text-lg lg:text-xl sm:translate-y-5">
          {["jpg", "png", "mp4", "mp3", "svg"].map((type) => (
            <button
              key={type}
              className={`transition-all duration-200 drop-shadow-md px-2 py-1 rounded ${
                extensionFilter === type
                  ? "text-bg scale-110 font-black bg-white/20"
                  : "hover:text-bg hover:scale-105 hover:bg-white/10"
              }`}
              onClick={() => handleFilterClick(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Barra de búsqueda */}
        <div className="w-full lg:w-auto">
          <div
            className="flex items-center bg-white text-bg px-4 sm:px-15 lg:px-8 py-2 sm:py-3 lg:py-3 shadow-md rounded-md"
            style={{
              clipPath:
                "polygon(0 36%, 94% 0, 100% 100%, 8% 100%)",
            }}
          >
            <Search className="w-5 h-5 mr-2 text-gray-600 flex-shrink-0 translate-y-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="font-adi bg-transparent outline-none w-full text-sm sm:text-base translate-y-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
