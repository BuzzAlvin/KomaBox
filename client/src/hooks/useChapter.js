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
        setError(null); // Clear previous errors

        let allChapters = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
          const data = await getChapterData(mangaId, limit, offset);

          console.log("📦 Received data:", data);
          console.log("📦 Data.data length:", data?.data?.length);

          if (data.data && data.data.length > 0) {
            const fetchedChapters = data.data.map((ch) => ({
              id: ch.id,
              number:
                ch.attributes.chapter !== null && ch.attributes.chapter !== ""
                  ? Number(ch.attributes.chapter)
                  : null,
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

        allChapters.sort((a, b) => {
          // If both have numbers, sort numerically
          if (a.number !== null && b.number !== null) {
            return a.number - b.number;
          }
          // Put numbered chapters before unnumbered
          if (a.number !== null) return -1;
          if (b.number !== null) return 1;
          // Both unnumbered, keep original order
          return 0;
        });

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
