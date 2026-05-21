import { useState, useEffect } from "react";
import { getMangaPages } from "../api/mangadex";

//this fetches only images for Read.jsx
export const useReadManga = (chapterId) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chapterId) return;

    const fetchPages = async () => {

      try {
        
        setLoading(true);
        setPages([]);

        const data = await getMangaPages(chapterId);

        setPages(data);
      } catch (error) {
        setError("Failed to load pages.");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [chapterId]);

  return { pages, loading, error };

};
