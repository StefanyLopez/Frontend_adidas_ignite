import { useState, useEffect, useMemo } from "react";
import { MediaService } from "../utilities/mediaService.jsx";

export const useMediaAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mediaService = useMemo(() => {
    const baseURL = "http://localhost:3000";
    return new MediaService(baseURL);
  }, []);


  useEffect(() => {
    mediaService
      .fetchAssets()
      .then((fetchedAssets) => {
        setAssets(fetchedAssets);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar assets:", err);
        setError(err);
        setLoading(false);
      });
  }, [mediaService]);

  return { assets, loading, error };
};
