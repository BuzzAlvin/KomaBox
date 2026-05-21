import { useState, useEffect } from "react";
import { getChapterData } from "../api/mangadex";

export const useChapter = (mangaId) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Time of update */
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };
  useEffect(() => {
    if (!mangaId) return;

    const fetchChapters = async () => {
      try {
        setLoading(true);
        setChapters([]); // Clear previous chapters when mangaId changes

        let allChapters = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
          const data = await getChapterData(mangaId, offset, limit);

          if (data.data && data.data.length > 0) {
            const fetchedChapters = data.data.map((ch) => ({
              id: ch.id,
              number: Number(ch.attributes.chapter),
              title: ch.attributes.title,
              time: formatTime(ch.attributes.readableAt),
            }));

            allChapters = [...allChapters, ...fetchedChapters];
            offset += limit;

            hasMore = data.data.length === limit;
          } else {
            hasMore = false;
          }
        }

        setChapters(allChapters);
      } catch (error) {
        setError("Failed to load chapters."); // error message
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mangaId) fetchChapters();
    
  }, [mangaId]);

  return { chapters, error, loading };
};
