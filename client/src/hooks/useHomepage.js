import { useEffect, useState } from "react";
import { getHomepageData } from "../api/mangadex";

export const useHomepage = () => {
  const [data, setData] = useState({
    latest: [],
    popular: [],
    trending: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Description of the Manga */
  const getDescription = (manga) => {
    const desc = manga.attributes?.description;

    if (!desc) return "No description available.";

    return desc.en || Object.values(desc)[0] || "No description available.";
  };

  /* Time of update */
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  /* Normalize manga list with cover URLs */
  const normalizeMangaList = (list) =>
    list.map((manga) => ({
      id: manga.id,
      title:
        manga.attributes?.title?.en ||
        Object.values(manga.attributes?.title || {})[0],
      cover: getCoverUrl(manga),
      description: getDescription(manga),
      source: "browse",
    }));

  useEffect(() => {
    const HomepageData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { latest, popular, trending } = await getHomepageData();

        console.log("Latest:", latest);
        console.log("Popular:", popular);
        console.log("Trending:", trending);

        // Process latest chapters
        const latestMap = new Map();

        latest.forEach((item) => {

           if (!item.id || latestMap.has(item.id)) return;

          latestMap.set(item.id, {
            id: item.id,
            chapterId: item.chapterId,
            title: item.title || "Unknown",
            cover: item.cover || "/images/kilobyte.png",
            latestChapter: item.chapter,
            time: formatTime(item.updatedAt),
            source: "latest",
          });
        });

        // Process popular manga
        const popularFormatted = popular.map((manga) => ({
          id: manga.id,
          title: manga.title || "Unknown",
          cover: manga.cover || "/images/kilobyte.png",
          description: manga.description || "No description available.",
          status: manga.status || "Unknown",
          source: "popular",
        }));

         // Process trending manga
        const trendingFormatted = trending.map((manga) => ({
          id: manga.id,
          title: manga.title || "Unknown",
          cover: manga.cover || "/images/kilobyte.png",
          description: manga.description || "No description available.",
          status: manga.status || "Unknown",
          source: "trending",
        }));


        setData((prevData) => ({
          ...prevData,
          latest: Array.from(latestMap.values()),
          popular: popularFormatted,
          trending: trendingFormatted,
        }));

        setError(null);
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching homepage data.",
        );
      } finally {
        setLoading(false);
      }
    };
    HomepageData();
  }, []);

  return { data, loading, error };
};
