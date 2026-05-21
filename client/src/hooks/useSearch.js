import { useState, useEffect } from "react";
import { searchManga } from "../api/mangadex";

const normalizeQuery = (q) => q.trim().toLowerCase();

export const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query?.trim()) return;

    const normalized = normalizeQuery(query);
    const cacheKey = `search-${normalized}`;

    const cached = localStorage.getItem(cacheKey);

    // 🧠 1. CACHE FIRST
    if (cached) {
      setResults(JSON.parse(cached));
      return;
    }

    const controller = new AbortController();

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        // 🧠 2. FETCH
        const data = await searchManga(normalized);

        if (controller.signal.aborted) return;

        setResults(data);

        // 🧠 3. CACHE RESULT
        localStorage.setItem(cacheKey, JSON.stringify(data));

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search failed:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query]);

  return { results, loading };
};