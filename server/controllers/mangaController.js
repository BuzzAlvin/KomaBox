//Get Homepage data
export const getHomepage = async (req, res) => {
  try {
    const latestRes = await fetch(
      "https://api.mangadex.org/chapter?order[readableAt]=desc&limit=30&translatedLanguage[]=en&includes[]=manga"
    );

    const popularRes = await fetch(
      "https://api.mangadex.org/manga?order[followedCount]=desc&limit=20&includes[]=cover_art"
    );

    const trendingRes = await fetch(
      "https://api.mangadex.org/manga?order[createdAt]=desc&limit=20&includes[]=cover_art"
    );

    const latestData = await latestRes.json();
    const popularData = await popularRes.json();
    const trendingData = await trendingRes.json();

    const extractCover = (manga) => {
      const coverRel = manga.relationships?.find(
        (rel) => rel.type === "cover_art"
      );
      const fileName = coverRel?.attributes?.fileName;
      return fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
        : null;
    };

    // ✅ Get unique manga IDs from latest chapters
    const uniqueMangaIds = [...new Set(
      latestData.data
        .map(ch => ch.relationships.find(r => r.type === "manga")?.id)
        .filter(Boolean)
    )];

    console.log(`Fetching covers for ${uniqueMangaIds.length} manga...`);

    // ✅ Use bulk fetch with proper URL encoding
    const coverMap = new Map();
    
    if (uniqueMangaIds.length > 0) {
      // MangaDex allows up to 100 IDs per request
      const idsParam = uniqueMangaIds.map(id => `ids[]=${id}`).join("&");
      const bulkUrl = `https://api.mangadex.org/manga?${idsParam}&limit=100&includes[]=cover_art`;
      
      console.log("Bulk URL length:", bulkUrl.length);
      
      try {
        const bulkRes = await fetch(bulkUrl);
        const bulkJson = await bulkRes.json();
        
        console.log("Bulk fetch result:", bulkJson.result);
        console.log("Manga returned:", bulkJson.data?.length);
        
        if (bulkJson.data && Array.isArray(bulkJson.data)) {
          bulkJson.data.forEach(manga => {
            const cover = extractCover(manga);
            if (cover) {
              coverMap.set(manga.id, cover);
            } else {
              console.log(`No cover for manga ${manga.id}`);
            }
          });
        }
      } catch (err) {
        console.error("Bulk cover fetch failed:", err.message);
      }
    }

    console.log(`Got ${coverMap.size} covers out of ${uniqueMangaIds.length} manga`);

    const latestFormatted = latestData.data.map((chapter) => {
      const mangaRel = chapter.relationships?.find((rel) => rel.type === "manga");
      const mangaId = mangaRel?.id;

      return {
        id: mangaId,
        chapterId: chapter.id,
        title:
          mangaRel?.attributes?.title?.en ||
          Object.values(mangaRel?.attributes?.title || {})[0] ||
          "Unknown",
        cover: mangaId ? (coverMap.get(mangaId) || null) : null,
        chapter: chapter.attributes.chapter,
        updatedAt: chapter.attributes.readableAt,
      };
    });

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
    console.error("Homepage error:", error);
    res.status(500).json({
      error: "Failed to fetch homepage data",
      details: error.message,
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


