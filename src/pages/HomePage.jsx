import { useState, useEffect, useMemo, useRef } from "react";
import RequestPopup from "../components/antiguo/RequestPopup";
import LoginAdminModal from "../components/LoginAdminModal";
import SelectionCart from "../components/SelectionCart";
import { MediaService } from "../utilities/mediaService";
import Header from "../components/Header";
import SplineBanner from "../components/Banner";
import Footer from "../components/Footer";
import PartnersBar from "../components/PartnersBar";
import FilterMenu from "../components/FilterMenu";
import Gallery from "../components/Gallery/Gallery";
import Card from "../components/Gallery/Card";
import AssetModal from "../components/AssetModal";

const HomePage = () => {
  const [mediaAssets, setMediaAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [selectedPreviewAsset, setSelectedPreviewAsset] = useState(null); // ✅ Cambio: un solo asset
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [extensionFilter, setExtensionFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const cartButtonRef = useRef(null);

  const mediaService = useMemo(
    () => new MediaService("http://localhost:3000"),
    []
  );

  useEffect(() => {
    mediaService
      .fetchAssets()
      .then((assets) => {
        console.log("URLs cargadas:", assets.map((a) => a.url));
        setMediaAssets(assets);
      })
      .catch((err) => console.error("Error al cargar assets:", err));
  }, [mediaService]);

  const getExtension = (url) => {
      const m = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
      return m ? m[1].toLowerCase() : "";
    };

  const displayedAssets = useMemo(() => {
    let filtered = mediaAssets;

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
  }, [extensionFilter, searchTerm, mediaAssets]);


  const handleSelect = (asset) => {
    console.log("HomePage - Selecting/deselecting asset:", asset);
    setSelectedAssets((prev) => {
      const exists = prev.some((a) => a.id === asset.id);
      if (exists) {
        const updated = prev.filter((a) => a.id !== asset.id);
        console.log("Asset removed, new count:", updated.length);
        return updated;
      } else {
        const updated = [...prev, asset];
        console.log("Asset added, new count:", updated.length);
        return updated;
      }
    });
  };

  const handleRemoveAsset = (assetId) => {
    console.log("Removing asset:", assetId);
    setSelectedAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  // ✅ Cambio: Función corregida para abrir el AssetModal
  const handleOpenPreview = (asset) => {
    console.log("Opening AssetModal for:", asset);
    setSelectedPreviewAsset(asset); // Guardar el asset completo
    setIsPreviewOpen(true);
  };

  // ✅ Cambio: Función corregida para cerrar el AssetModal
  const handleClosePreview = () => {
    console.log("Closing AssetModal");
    setIsPreviewOpen(false);
    setSelectedPreviewAsset(null);
  };

  const handleContinueToRequest = () => {
    console.log("Continuing to request with assets:", selectedAssets);
    setShowCart(false);
    setShowPopup(true);
  };

  const handleSubmitRequest = async (formData) => {
    const selected = new Date(formData.deadline).setHours(0, 0, 0, 0);
    const startToday = new Date().setHours(0, 0, 0, 0);
    
    if (selected < startToday) {
      // Mantener este alert porque es validación, no confirmación
      alert("The deadline cannot be earlier than today.");
      return;
    }

    const payload = {
      requesterName: formData.name,
      requesterEmail: formData.email,
      purpose: formData.purpose,
      deadline: formData.deadline,
      items: selectedAssets.map((a) => a.id),
      assetsCount: selectedAssets.length
    };

    try {
      const response = await fetch("http://localhost:3000/test/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // ✅ Remover alert - el popup se encargará de mostrar la confirmación
        setSelectedAssets([]); // Limpiar selección
        // No cerrar el cart aquí, el popup manejará el flujo
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      console.error("Error:", error);
      // ✅ Solo lanzar el error, el popup lo manejará
      throw error;
    }
  };

  const selectedAssetsArray = Array.isArray(selectedAssets) ? selectedAssets : [];
  const selectedIds = selectedAssetsArray.map((a) => a.id);

  console.log("Render - selectedAssets:", selectedAssetsArray.length, "showCart:", showCart);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-white">
      <Header onLoginClick={() => setShowLoginModal(true)} />
      <SplineBanner />
      <PartnersBar />
      
<main className="px-20 py-10">
        {/* ✅ CAMBIO: Usar displayedAssets en lugar de mediaAssets */}
        <Gallery
          assets={displayedAssets}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onOpenModal={handleOpenPreview}
        />

        {/* ✅ Mostrar mensaje si no hay resultados */}
        {displayedAssets.length === 0 && mediaAssets.length > 0 && (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center bg-orange/10">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white font-bebas">
                NO SE ENCONTRARON RESULTADOS
              </h3>
              <p className="text-lg text-white/70 mb-6 font-adi" >
                {searchTerm && extensionFilter 
                  ? `No hay assets de tipo "${extensionFilter.toUpperCase()}" que coincidan con "${searchTerm}"`
                  : searchTerm 
                  ? `No hay assets que coincidan con "${searchTerm}"`
                  : `No hay assets de tipo "${extensionFilter?.toUpperCase()}"`
                }
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 bg-orange/20 text-orange border-2 border-orange rounded-xl hover:bg-orange hover:text-white transition-all duration-200 font-adi"
                  style={{ fontFamily: 'var(--font-adi)' }}
                >
                  Limpiar búsqueda
                </button>
              )}
              
              {extensionFilter && (
                <button
                  onClick={() => setExtensionFilter(null)}
                  className="px-6 py-3 bg-orange/20 text-orange border-2 border-orange rounded-xl hover:bg-orange hover:text-white transition-all duration-200 font-bold"
                  style={{ fontFamily: 'var(--font-adi)' }}
                >
                  Mostrar todos los tipos
                </button>
              )}
              
              {(searchTerm || extensionFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setExtensionFilter(null);
                  }}
                  className="px-6 py-3 bg-orange text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-adi"
                >
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* ✅ Mostrar contador de resultados cuando hay filtros activos */}
        {(searchTerm || extensionFilter) && displayedAssets.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-white/70" style={{ fontFamily: 'var(--font-adi)' }}>
              Mostrando {displayedAssets.length} de {mediaAssets.length} assets
              {extensionFilter && ` • Tipo: ${extensionFilter.toUpperCase()}`}
              {searchTerm && ` • Búsqueda: "${searchTerm}"`}
            </p>
          </div>
        )}
      </main>


      {/* Botón del carrito */}
      <div className="fixed bottom-16 right-16 z-40">
        <button
          ref={cartButtonRef}
          onClick={() => {
            console.log("Cart button clicked, assets:", selectedAssets.length);
            if (selectedAssets.length === 0) {
              alert("No tienes assets seleccionados");
              return;
            }
            setShowCart(true);
          }}
          className={`w-16 h-16 rounded-full bg-orange text-white text-xl shadow-lg hover:scale-105 transition relative ${
            selectedAssets.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={selectedAssets.length === 0}
        >
          🛒
          {selectedAssets.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {selectedAssets.length}
            </span>
          )}
        </button>
      </div>

      {/* Popup del carrito */}
      {showCart && (
        <RequestPopup
          selectedAssets={selectedAssets}
          onClose={() => setShowCart(false)}
          onRemoveAsset={handleRemoveAsset}
          onSubmit={handleSubmitRequest}
          cartButtonRef={cartButtonRef}
        />
      )}

      {/* Modal de login */}
      {showLoginModal && (
        <LoginAdminModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* ✅ CAMBIO PRINCIPAL: Usar AssetModal en lugar del modal básico */}
      {isPreviewOpen && selectedPreviewAsset && (
        <AssetModal 
          asset={selectedPreviewAsset} 
          onClose={handleClosePreview} 
        />
      )}

      <Footer />
    </div>
  );
};

export default HomePage;