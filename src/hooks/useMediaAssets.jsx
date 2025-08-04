import { useState, useEffect, useMemo } from "react";
import { MediaService } from "../utilities/mediaService.jsx";

/**
 * Custom React hook for managing media assets
 * Provides loading state, error handling, and asset data from MediaService
 *
 * @returns {Object} Object containing:
 *   - assets: Array of media asset objects
 *   - loading: Boolean indicating if assets are being fetched
 *   - error: Error object if fetch failed, null otherwise
 */
export const useMediaAssets = () => {
  // State for storing fetched media assets
  const [assets, setAssets] = useState([]);

  // Loading state to track fetch progress
  const [loading, setLoading] = useState(true);

  // Error state to handle fetch failures
  const [error, setError] = useState(null);

  // Memoized MediaService instance to prevent unnecessary re-instantiation
  const mediaService = useMemo(() => {
    const baseURL = "http://localhost:3000";
    return new MediaService(baseURL);
  }, []);

  // Effect to fetch assets when component mounts or mediaService changes
  useEffect(() => {
    mediaService
      .fetchAssets()
      .then((fetchedAssets) => {
        // Successfully fetched assets
        setAssets(fetchedAssets);
        setLoading(false);
      })
      .catch((err) => {
        // Handle fetch errors
        console.error("Error loading assets:", err);
        setError(err);
        setLoading(false);
      });
  }, [mediaService]);

  // Return hook state for consuming components
  return { assets, loading, error };
};
