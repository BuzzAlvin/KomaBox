import { useState, useEffect } from "react";
import { getMangaDetail } from "../api/mangadex";

//This Fecthes manga details like author, title, description e.t.c.
export const useMangaDetail = (mangaId) => {
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //Rating
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        setLoading(true);

        const data = await getMangaDetail(mangaId);

        setRating(data.stats);
        setManga(data.manga);
      } catch (err) {
        setError(err.message || "An error occurred while fetching manga.");
      } finally {
        setLoading(false);
      }
    };

    if (mangaId) fetchManga();
  }, [mangaId]);

  // guard BEFORE using manga and stats
  if (!manga || !rating) {
    return { loading, error };
  }

  // derived data OUTSIDE useEffect
  const title =
    manga.attributes?.title?.en ||
    Object.values(manga.attributes?.title || {})[0];

  const altTitles = manga.attributes?.altTitles || [];

  const altTitle =
    altTitles.find((obj) => obj.en)?.en ||
    altTitles.map((obj) => Object.values(obj)[0])[0] ||
    "";

  const tags =
    manga.attributes?.tags?.map((tag) => ({
      id: tag.id,
      name: tag.attributes?.name?.en,
    })) || [];

  const statsData = rating[mangaId] || {};

  const ratings = statsData?.rating?.average || 0;
  const follows = statsData?.follows || 0;

  const description =
    manga.attributes?.description?.en ||
    Object.values(manga.attributes?.description || {})[0];

  const coverRel = manga.relationships?.find((r) => r.type === "cover_art");

  const cover = coverRel
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
    : "/images/kilobyte.png";

  const artist = manga.relationships?.find((r) => r.type === "artist")
    ?.attributes?.name;

  const author = manga.relationships?.find((r) => r.type === "author")
    ?.attributes?.name;

  const status = manga.attributes?.status || "Unknown";

  return {
    title,
    description,
    altTitle,
    cover,
    ratings,
    follows,
    artist,
    status,
    author,
    tags,
    loading,
    error,
  };
};
