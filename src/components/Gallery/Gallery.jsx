import React, { useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/all";
import Card from "./Card";
import AssetModal from "../AssetModal.jsx";
import FilterMenu from "../FilterMenu"; // Ajusta la ruta según tu estructura
import { useMediaAssets } from "../../hooks/useMediaAssets";
import Button from "../Button.jsx"

gsap.registerPlugin(Flip);

// ✅ Recibir props desde HomePage
const Gallery = ({ selectedIds = [], onSelect, onOpenModal }) => {
  const { assets, loading, error } = useMediaAssets();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  
  // ✅ Estados para filtrado
  const [extensionFilter, setExtensionFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const containerRef = useRef(null);

  // ✅ Función para obtener extensión de archivo
  const getExtension = (url) => {
    const m = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
    return m ? m[1].toLowerCase() : "";
  };

  // ✅ Filtrado de assets
  const filteredAssets = useMemo(() => {
    let filtered = assets;

    // Filtrar por extensión
    if (extensionFilter) {
      filtered = filtered.filter(
        (asset) => getExtension(asset.url) === extensionFilter
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (asset) =>
          asset.titulo?.toLowerCase().includes(searchLower) ||
          asset.descripcion?.toLowerCase().includes(searchLower) ||
          asset.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [extensionFilter, searchTerm, assets]);

  // ✅ Assets visibles después del filtrado
  const visibleAssets = filteredAssets.slice(0, visibleCount);

  const handleOpenModal = (asset) => {
    console.log("Opening modal for asset:", asset);
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowModal(false);
    setSelectedAsset(null);
  };

  // ✅ Usar la función onSelect que viene desde HomePage
  const handleCardSelect = (asset) => {
    console.log("Gallery - selecting asset:", asset);
    onSelect(asset); // Usar la función del HomePage
  };

  // ✅ Función para mostrar más assets
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  // ✅ Función para limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setExtensionFilter(null);
    setVisibleCount(8); // Reset también el contador
  };

  if (loading) return <p className="text-center text-white">Loading assets...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="relative">
      {/* ✅ FilterMenu integrado */}
      <FilterMenu
        extensionFilter={extensionFilter}
        setExtensionFilter={setExtensionFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-adi text-orange">
            Asset Gallery
          </h2>
          
          {/* ✅ Contador de resultados */}
          <div className="text-white opacity-70 font-adi">
            {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} 
            {(extensionFilter || searchTerm) && (
              <span className="text-orange ml-2">
                (filtered{extensionFilter && ` - ${extensionFilter.toUpperCase()}`})
              </span>
            )}
          </div>
        </div>

        {/* ✅ Mensaje cuando no hay resultados */}
        {filteredAssets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                 style={{ backgroundColor: 'rgba(255, 157, 0, 0.1)' }}>
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-adi text-white mb-4">
              No assets found
            </h3>
            <p className="text-white opacity-70 mb-6">
              {searchTerm && extensionFilter 
                ? `There are no assets of type ${extensionFilter.toUpperCase()} that match "${searchTerm}"`
                : searchTerm 
                ? `There are no assets that match "${searchTerm}"`
                : extensionFilter 
                ? `There are no assets of type ${extensionFilter.toUpperCase()}`
                : "No assets available"
              }
            </p>
            {(searchTerm || extensionFilter) && (
              <Button
                text="Clean filters"
                filled={false}
                onClick={handleClearFilters}
              />
            )}
          </div>
        ) : (
          <>
            {/* Grid responsivo que se adapta al contenido */}
            <div
              ref={containerRef}
              className="grid gap-4 sm:gap-6 lg:gap-8 justify-items-center"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 400px))',
                justifyContent: 'center'
              }}
            >
              {visibleAssets.map((asset) => (
                <Card
                  key={asset.id}
                  asset={asset}
                  selectedIds={selectedIds} // ✅ Pasar selectedIds desde HomePage
                  onSelect={handleCardSelect} // ✅ Usar función que conecta con HomePage
                  onOpenModal={onOpenModal || handleOpenModal} // ✅ Usar función desde HomePage o fallback
                />
              ))}
            </div>

            {/* ✅ Botón Load More actualizado */}
            {visibleCount < filteredAssets.length && (
              <div className="mt-10 flex justify-center items-left ">
                <Button 
                  text={`Load  (${filteredAssets.length - visibleCount})`}
                  filled={false} 
                  onClick={handleLoadMore}
                />
              </div>
            )}

            {/* ✅ Información adicional cuando hay filtros activos */}
            {(extensionFilter || searchTerm) && visibleAssets.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-white opacity-60 text-sm">
                  Showing {Math.min(visibleCount, filteredAssets.length)} {filteredAssets.length} filtered assets
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-orange hover:text-orange-400 transition-colors text-sm mt-2 underline"
                >
                  See all assets
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal condicional */}
      {showModal && selectedAsset && (
        <AssetModal 
          asset={selectedAsset} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Gallery;