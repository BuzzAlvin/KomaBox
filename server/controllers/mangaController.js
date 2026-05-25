//Get Homepage data
export const getHomepage = async (req, res) => {
  try {
    const [latestRes, popularRes, trendingRes] = await Promise.all([
      fetch(
        "https://api.mangadex.org/chapter?order[readableAt]=desc&limit=30&translatedLanguage[]=en&includes[]=manga&includes[]=cover_art",
      ),
      fetch(
        "https://api.mangadex.org/manga?order[followedCount]=desc&limit=20&includes[]=cover_art",
      ),
      fetch(
        "https://api.mangadex.org/manga?order[createdAt]=desc&limit=20&includes[]=cover_art",
      ),
    ]);

    const [latestData, popularData, trendingData] = await Promise.all([
      latestRes.json(),
      popularRes.json(),
      trendingRes.json(),
    ]);

    // Helper to extract cover
    const extractCover = (manga) => {
      const coverRel = manga.relationships?.find(
        (rel) => rel.type === "cover_art"
      );
      const fileName = coverRel?.attributes?.fileName;
      return fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
        : null;
    };

    // Format latest chapters
    const latestFormatted = latestData.data.map((chapter) => {
      const mangaRel = chapter.relationships?.find(
        (rel) => rel.type === "manga"
      );
      const coverRel = chapter.relationships?.find(
        (rel) => rel.type === "cover_art"
      );

      const mangaId = mangaRel?.id;
      const fileName = coverRel?.attributes?.fileName;

      return {
        id: mangaId,
        chapterId: chapter.id,
        title:
          mangaRel?.attributes?.title?.en ||
          Object.values(mangaRel?.attributes?.title || {})[0] ||
          "Unknown",
        cover: fileName && mangaId
          ? `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`
          : null,
        chapter: chapter.attributes.chapter,
        updatedAt: chapter.attributes.readableAt,
      };
    });

    // Format popular manga
    const popularFormatted = popularData.data.map((manga) => ({
      id: manga.id,
      title:
        manga.attributes.title.en ||
        Object.values(manga.attributes.title)[0] ||
        "Unknown",
      cover: extractCover(manga),
      description: manga.attributes.description?.en || "",
      status: manga.attributes.status,
    }));

    // Format trending manga
    const trendingFormatted = trendingData.data.map((manga) => ({
      id: manga.id,
      title:
        manga.attributes.title.en ||
        Object.values(manga.attributes.title)[0] ||
        "Unknown",
      cover: extractCover(manga),
      description: manga.attributes.description?.en || "",
      status: manga.attributes.status,
    }));

    res.json({
      latest: latestFormatted,
      popular: popularFormatted,
      trending: trendingFormatted,
    });


  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch homepage data",
    });
  }
};

//Get Recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { mangaId } = req.params;

    // fetch manga details
    const mangaRes = await fetch(
      `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`,
    );

    const mangaData = await mangaRes.json();

    // extract tags
    const tags = mangaData.data.attributes.tags
      .filter((tag) => tag.attributes.group === "genre")
      .slice(0, 3)
      .map((tag) => tag.id);

    // build tag params
    const tagParams = tags.map((tag) => `includedTags[]=${tag}`).join("&");

    // fetch recommendations
    const searchRes = await fetch(
      `https://api.mangadex.org/manga?${tagParams}&limit=20&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&order[rating]=desc`,
    );

    const searchData = await searchRes.json();

    const recommendations = searchData.data
      .filter((manga) => manga.id !== mangaId)
      .map((manga) => {
        const coverRelationship = manga.relationships.find(
          (rel) => rel.type === "cover_art",
        );

        const coverId = coverRelationship?.attributes?.fileName;

        return {
          id: manga.id,
          title:
            manga.attributes.title.en ||
            Object.values(manga.attributes.title)[0],

          cover: coverId
            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverId}.256.jpg`
            : null,

          description: manga.attributes.description?.en || "",

          status: manga.attributes.status,
        };
      })
      .slice(0, 20); // Limit to 20 recommendations

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch recommendations",
    });
  }
};

//Get Chapter data
export const getChapters = async (req, res) => {
  try {
    const { mangaId } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    const response = await fetch(
      `https://api.mangadex.org/chapter?manga=${mangaId}&translatedLanguage[]=en&limit=${limit}&offset=${offset}&order[chapter]=asc`,
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch chapters",
    });
  }
};

//Get Manga Details
export const getMangaDetails = async (req, res) => {
  try {
    const { mangaId } = req.params;

    // manga info
    const mangaRes = await fetch(
      `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist`,
    );

    const mangaData = await mangaRes.json();

    // statistics
    const statsRes = await fetch(
      `https://api.mangadex.org/statistics/manga/${mangaId}`,
    );

    const statsData = await statsRes.json();

    res.json({
      manga: mangaData.data,
      stats: statsData.statistics,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch manga details",
    });
  }
};

//Get Manga Pages
export const getMangaPages = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const response = await fetch(
      `https://api.mangadex.org/at-home/server/${chapterId}`,
      {
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!data.chapter) {
      return res.status(404).json({
        error: "Chapter not found",
      });
    }

    const pagesArray =
      data.chapter.data?.length > 0
        ? data.chapter.data
        : data.chapter.dataSaver || [];

    const isSaver = !data.chapter.data?.length;

    const pages = pagesArray.map(
      (file) =>
        `${data.baseUrl}/${
          isSaver ? "data-saver" : "data"
        }/${data.chapter.hash}/${file}`,
    );

    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.json(pages);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch chapter pages",
    });
  }
};

//Get Random Manga Images
export const getRandomManga = async (req, res) => {
  try {
    const limit = 20;

    const offset =
      parseInt(req.query.offset) || Math.floor(Math.random() * 1000);

    const response = await fetch(
      `https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&contentRating[]=safe`,
    );

    const data = await response.json();

    const formatted = data.data.map((manga) => {
      const coverRel = manga.relationships.find(
        (rel) => rel.type === "cover_art",
      );

      const fileName = coverRel?.attributes?.fileName;

      return {
        id: manga.id,
        title:
          manga.attributes.title.en || Object.values(manga.attributes.title)[0],
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
          : null,

        coverOriginal: fileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
          : null,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch random manga",
    });
  }
};

//Search Manga
export const searchManga = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ error: "Missing query" });
    }

    const searchRes = await fetch(
      `https://api.mangadex.org/manga?title=${title}&limit=5&includes[]=cover_art&includes[]=artist`,
    );

    const searchData = await searchRes.json();

    const results = await Promise.all(
      searchData.data.map(async (manga) => {
        const coverRel = manga.relationships.find(
          (rel) => rel.type === "cover_art",
        );

        const fileName = coverRel?.attributes?.fileName;

        // aggregate
        const aggRes = await fetch(
          `https://api.mangadex.org/manga/${manga.id}/aggregate`,
        );

        const aggData = await aggRes.json();

        const chapters = Object.values(aggData.volumes || {})
          .flatMap((v) => Object.keys(v.chapters || {}))
          .map(Number)
          .filter(Boolean)
          .sort((a, b) => a - b);

        return {
          id: manga.id,
          title:
            manga.attributes.title.en ||
            Object.values(manga.attributes.title)[0],
          cover: fileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
            : null,
          updatedAt: manga.attributes.updatedAt,
          firstChapter: chapters[0] || "N/A",
          latestChapter: chapters[chapters.length - 1] || "N/A",
        };
      }),
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

//proxy images
export const proxyImage = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    // Only allow MangaDex image URLs for security
    const allowedDomains = [
      "uploads.mangadex.org",
      "cmdxd98sb0x3yprd.mangadex.network",
      "mangadex.network",
    ];

    const isAllowed = allowedDomains.some((domain) => url.includes(domain));

    if (!isAllowed) {
      return res.status(403).json({ error: "Domain not allowed" });
    }

    const response = await fetch(url, {
      headers: {
        "Referer": "https://mangadex.org",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch image" });
    }

    // Get content type
    const contentType = response.headers.get("content-type") || "image/jpeg";
    
    // Set headers
    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=86400"); // Cache for 24 hours

    // Stream image directly to frontend
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error("Image proxy error:", error);
    res.status(500).json({ error: "Failed to proxy image" });
  }
};
