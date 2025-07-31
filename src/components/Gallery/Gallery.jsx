import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/all";
import Card from "./Card";
import AssetModal from "../Antiguo/AssetModal.jsx";
import { useMediaAssets } from "../../hooks/useMediaAssets";

gsap.registerPlugin(Flip);

const Gallery = () => {
  const { assets, loading, error } = useMediaAssets();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const containerRef = useRef(null);

  const visibleAssets = assets.slice(0, visibleCount);

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  if (loading) return <p className="text-center text-white">Cargando assets...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="relative px-8">
      <h2 className="text-4xl font-adi text-orange mb-6">Galería de Assets</h2>

      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        {visibleAssets.map((item) => (
          <Card key={item.id} asset={item} onSelect={handleSelectAsset} />
        ))}
      </div>

      {visibleCount < assets.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="bg-orange hover:bg-yellow-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Cargar más
          </button>
        </div>
      )}

      {showModal && selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Gallery;
