import { useRef, useState, useMemo } from "react";
import { useMediaAssets } from "../../hooks/useMediaAssets";
import Card from "./Card";
import AssetModal from "../AssetModal.jsx";
import FilterMenu from "../FilterMenu";
import Button from "../Button.jsx";

/**
 * Gallery Component - Main gallery view displaying filterable asset cards
 * Handles asset selection, filtering, pagination, and modal display
 *
 * @param {Array} selectedIds - Array of currently selected asset IDs from parent
 * @param {Function} onSelect - Callback function to handle asset selection
 * @param {Function} onOpenModal - Callback function to open asset preview modal
 */
const Gallery = ({ selectedIds = [], onSelect, onOpenModal }) => {
  // Fetch assets data using custom hook
  const { assets, loading, error } = useMediaAssets();

  // Modal state management
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination state - controls how many assets are visible
  const [visibleCount, setVisibleCount] = useState(8);

  // Filtering states
  const [extensionFilter, setExtensionFilter] = useState(null); // Filter by file extension
  const [searchTerm, setSearchTerm] = useState(""); // Search term for text filtering

  // Reference to the grid container
  const containerRef = useRef(null);

  /**
   * Extract file extension from URL for filtering purposes
   * @param {string} url - The asset URL
   * @returns {string} - Lowercase file extension or empty string
   */
  const getExtension = (url) => {
    const m = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
    return m ? m[1].toLowerCase() : "";
  };

  /**
   * Memoized filtered assets based on current filter criteria
   * Filters by both extension and search term simultaneously
   */
  const filteredAssets = useMemo(() => {
    let filtered = assets;

    // Apply extension filter if selected
    if (extensionFilter) {
      filtered = filtered.filter(
        (asset) => getExtension(asset.url) === extensionFilter
      );
    }

    // Apply text search filter if search term exists
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (asset) =>
          // Search in title, description, and tags
          asset.titulo?.toLowerCase().includes(searchLower) ||
          asset.descripcion?.toLowerCase().includes(searchLower) ||
          asset.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [extensionFilter, searchTerm, assets]);

  // Get currently visible assets based on pagination
  const visibleAssets = filteredAssets.slice(0, visibleCount);

  /**
   * Handle opening preview modal for a specific asset
   * @param {Object} asset - The asset to preview
   */
  const handleOpenModal = (asset) => {
    console.log("Opening modal for asset:", asset);
    setSelectedAsset(asset);
    setShowModal(true);
  };

  /**
   * Handle closing the preview modal and clearing selected asset
   */
  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowModal(false);
    setSelectedAsset(null);
  };

  /**
   * Handle card selection - delegates to parent component's onSelect function
   * @param {Object} asset - The selected asset object
   */
  const handleCardSelect = (asset) => {
    console.log("Gallery - selecting asset:", asset);
    onSelect(asset); // Use the function from HomePage
  };

  /**
   * Load more assets by increasing the visible count
   * Adds 8 more assets to the current view
   */
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  /**
   * Clear all active filters and reset pagination
   * Returns gallery to initial unfiltered state
   */
  const handleClearFilters = () => {
    setSearchTerm("");
    setExtensionFilter(null);
    setVisibleCount(8); // Reset pagination counter as well
  };

  // Loading state display
  if (loading)
    return <p className="text-center text-white">Loading assets...</p>;

  // Error state display
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="relative">
      {/* Integrated filter menu component */}
      <FilterMenu
        extensionFilter={extensionFilter}
        setExtensionFilter={setExtensionFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Gallery header with title and results counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bebas text-orange">
            Asset Gallery
          </h2>

          {/* Results counter with filter status indicator */}
          <div className="text-white opacity-70 font-adi text-sm sm:text-base">
            {filteredAssets.length} asset
            {filteredAssets.length !== 1 ? "s" : ""}
            {(extensionFilter || searchTerm) && (
              <span className="text-orange ml-2">
                (filtered
                {extensionFilter && ` - ${extensionFilter.toUpperCase()}`})
              </span>
            )}
          </div>
        </div>

        {/* Empty state when no assets match current filters */}
        {filteredAssets.length === 0 ? (
          <div className="text-center py-8 sm:py-12 md:py-16">
            {/* Search icon with background */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255, 157, 0, 0.1)" }}
            >
              <span className="text-2xl sm:text-3xl md:text-4xl">🔍</span>
            </div>

            {/* No results message */}
            <h3 className="text-xl sm:text-2xl font-adi text-white mb-3 sm:mb-4">
              No assets found
            </h3>

            {/* Contextual message based on active filters */}
            <p className="text-white opacity-70 mb-4 sm:mb-6 text-sm sm:text-base px-4">
              {searchTerm && extensionFilter
                ? `There are no assets of type ${extensionFilter.toUpperCase()} that match "${searchTerm}"`
                : searchTerm
                ? `There are no assets that match "${searchTerm}"`
                : extensionFilter
                ? `There are no assets of type ${extensionFilter.toUpperCase()}`
                : "No assets available"}
            </p>

            {/* Clear filters button - only shown when filters are active */}
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
            {/* Responsive grid that adapts to content */}
            <div
              ref={containerRef}
              className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-items-center"
              style={{
                // Responsive grid with different min sizes for different screen sizes
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                justifyContent: "center",
              }}
            >
              {/* Render visible asset cards */}
              {visibleAssets.map((asset) => (
                <Card
                  key={asset.id}
                  asset={asset}
                  selectedIds={selectedIds} // Pass selected IDs from HomePage
                  onSelect={handleCardSelect} // Use function that connects with HomePage
                  onOpenModal={onOpenModal || handleOpenModal} // Use HomePage function or fallback
                />
              ))}
            </div>

            {/* Load More button - shown only when there are more assets to load */}
            {visibleCount < filteredAssets.length && (
              <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center">
                <Button
                  text={`Load More (${filteredAssets.length - visibleCount})`}
                  filled={false}
                  onClick={handleLoadMore}
                />
              </div>
            )}

            {/* Additional information when filters are active and results exist */}
            {(extensionFilter || searchTerm) && visibleAssets.length > 0 && (
              <div className="mt-6 sm:mt-8 text-center">
                {/* Status message showing current pagination state */}
                <p className="text-white opacity-60 text-xs sm:text-sm">
                  Showing {Math.min(visibleCount, filteredAssets.length)} of{" "}
                  {filteredAssets.length} filtered assets
                </p>

                {/* Quick link to clear filters and see all assets */}
                <button
                  onClick={handleClearFilters}
                  className="text-orange hover:text-orange-400 transition-colors text-xs sm:text-sm mt-2 underline"
                >
                  See all assets
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Conditional modal rendering - only shown when an asset is selected for preview */}
      {showModal && selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Gallery;