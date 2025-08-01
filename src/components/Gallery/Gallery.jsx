import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/all";
import Card from "./Card";
import AssetModal from "../AssetModal.jsx";
import { useMediaAssets } from "../../hooks/useMediaAssets";
import Button from "../Button.jsx"

gsap.registerPlugin(Flip);

// ✅ Recibir props desde HomePage
const Gallery = ({ selectedIds = [], onSelect, onOpenModal }) => {
  const { assets, loading, error } = useMediaAssets();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const containerRef = useRef(null);

  const visibleAssets = assets.slice(0, visibleCount);

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

  if (loading) return <p className="text-center text-white">Cargando assets...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-adi text-orange mb-6">Galería de Assets</h2>

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

      {visibleCount < assets.length && (
        <div className="mt-10 flex justify-center">
          <Button 
            text="Load More" 
            filled={false} 
            onClick={() => setVisibleCount((prev) => prev + 8)} 
          />
        </div>
      )}

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