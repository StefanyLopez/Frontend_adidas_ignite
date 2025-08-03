import { useState, useEffect, useMemo, useRef } from "react";
import { MediaService } from "../utilities/mediaService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SplineBanner from "../components/Banner";
import PartnersBar from "../components/PartnersBar";
import Gallery from "../components/Gallery/Gallery";
import RequestPopup from "../components/Cart/RequestPopup";
import AssetModal from "../components/AssetModal";

const HomePage = () => {
  // Main data states
  const [mediaAssets, setMediaAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [selectedPreviewAsset, setSelectedPreviewAsset] = useState(null); // Single asset for preview
  
  // UI modal states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Filter and search states
  const [extensionFilter, setExtensionFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Reference for cart button positioning
  const cartButtonRef = useRef(null);

  // Media service instance for API calls
  const mediaService = useMemo(
    () => new MediaService("http://localhost:3000"),
    []
  );

  // Fetch assets on component mount
  useEffect(() => {
    mediaService
      .fetchAssets()
      .then((assets) => {
        console.log("URLs loaded:", assets.map((a) => a.url));
        setMediaAssets(assets);
      })
      .catch((err) => console.error("Error loading assets:", err));
  }, [mediaService]);

  // Extract file extension from URL
  const getExtension = (url) => {
      const m = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
      return m ? m[1].toLowerCase() : "";
    };

  // Filter and search assets based on current filters
  const displayedAssets = useMemo(() => {
    let filtered = mediaAssets;

    // Filter by file extension
    if (extensionFilter) {
      filtered = filtered.filter(
        (asset) => getExtension(asset.url) === extensionFilter
      );
    }

    // Filter by search term (title, description, tags)
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

  // Handle asset selection/deselection for cart
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

  // Remove specific asset from cart
  const handleRemoveAsset = (assetId) => {
    console.log("Removing asset:", assetId);
    setSelectedAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  // Open asset preview modal
  const handleOpenPreview = (asset) => {
    console.log("Opening AssetModal for:", asset);
    setSelectedPreviewAsset(asset); // Store complete asset object
    setIsPreviewOpen(true);
  };

  // Close asset preview modal
  const handleClosePreview = () => {
    console.log("Closing AssetModal");
    setIsPreviewOpen(false);
    setSelectedPreviewAsset(null);
  };

  // Continue from cart to request form
  const handleContinueToRequest = () => {
    console.log("Continuing to request with assets:", selectedAssets);
    setShowCart(false);
    setShowPopup(true);
  };

  // Submit request with form data and selected assets
  const handleSubmitRequest = async (formData) => {
    // Validate deadline is not in the past
    const selected = new Date(formData.deadline).setHours(0, 0, 0, 0);
    const startToday = new Date().setHours(0, 0, 0, 0);
    
    if (selected < startToday) {
      alert("The deadline cannot be earlier than today.");
      return;
    }

    // Prepare request payload
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
        setSelectedAssets([]); // Clear selection after successful submission
        // Popup will handle the success flow
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      console.error("Error:", error);
      // Re-throw error for popup to handle
      throw error;
    }
  };

  // Ensure selectedAssets is always an array and extract IDs
  const selectedAssetsArray = Array.isArray(selectedAssets) ? selectedAssets : [];
  const selectedIds = selectedAssetsArray.map((a) => a.id);

  console.log("Render - selectedAssets:", selectedAssetsArray.length, "showCart:", showCart);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-white">
      <Header onLoginClick={() => setShowLoginModal(true)} />
      <SplineBanner />
      <PartnersBar />
      
    <main className="px-20 py-10">
        {/* Gallery component with filtered assets */}
        <Gallery
          assets={displayedAssets}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onOpenModal={handleOpenPreview}
        />

        {/* No results message when filters are applied */}
        {displayedAssets.length === 0 && mediaAssets.length > 0 && (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center bg-orange/10">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white font-bebas">
                NO RESULTS FOUND
              </h3>
              <p className="text-lg text-white/70 mb-6 font-adi" >
                {searchTerm && extensionFilter 
                  ? `No "${extensionFilter.toUpperCase()}" assets match "${searchTerm}"`
                  : searchTerm 
                  ? `No assets match "${searchTerm}"`
                  : `No "${extensionFilter?.toUpperCase()}" assets found`
                }
              </p>
            </div>
            
            {/* Filter clear buttons */}
            <div className="flex gap-4 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 bg-orange/20 text-orange border-2 border-orange rounded-xl hover:bg-orange hover:text-white transition-all duration-200 font-adi"
                  style={{ fontFamily: 'var(--font-adi)' }}
                >
                  Clear search
                </button>
              )}
              
              {extensionFilter && (
                <button
                  onClick={() => setExtensionFilter(null)}
                  className="px-6 py-3 bg-orange/20 text-orange border-2 border-orange rounded-xl hover:bg-orange hover:text-white transition-all duration-200 font-bold"
                  style={{ fontFamily: 'var(--font-adi)' }}
                >
                  Show all types
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
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results counter when filters are active */}
        {(searchTerm || extensionFilter) && displayedAssets.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-white/70" style={{ fontFamily: 'var(--font-adi)' }}>
              Showing {displayedAssets.length} of {mediaAssets.length} assets
              {extensionFilter && ` • Type: ${extensionFilter.toUpperCase()}`}
              {searchTerm && ` • Search: "${searchTerm}"`}
            </p>
          </div>
        )}
      </main>

      {/* Floating cart button */}
      <div className="fixed bottom-16 right-16 z-40">
        <button
          ref={cartButtonRef}
          onClick={() => {
            console.log("Cart button clicked, assets:", selectedAssets.length);
            if (selectedAssets.length === 0) {
              alert("No assets selected");
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
          {/* Badge showing selected assets count */}
          {selectedAssets.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {selectedAssets.length}
            </span>
          )}
        </button>
      </div>

      {/* Cart popup modal */}
      {showCart && (
        <RequestPopup
          selectedAssets={selectedAssets}
          onClose={() => setShowCart(false)}
          onRemoveAsset={handleRemoveAsset}
          onSubmit={handleSubmitRequest}
          cartButtonRef={cartButtonRef}
        />
      )}

      {/* Login modal */}
      {showLoginModal && (
        <LoginAdminModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* Asset preview modal */}
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