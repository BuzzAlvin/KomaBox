import { useState, useCallback } from "react";
import { getRecommendations } from "../api/mangadex";

export const useRecommendations = (mangaId) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!mangaId || fetched || loading) return;
    
    try {
      setLoading(true);
      setError(null);

        const data = await getRecommendations(mangaId);

      if (!data || !data.data) {
        setRecommendations([]);
        setFetched(true);
        console.log("No recommendations found.");
        return;
      }
    

      setRecommendations(data);
      setFetched(true);
    } catch (error) {
      setError("Failed to load recommendations.");
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  }, [mangaId, fetched, loading]);

  return { recommendations, loading, error, fetchRecommendations, fetched };
};