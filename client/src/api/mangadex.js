const API_URL = import.meta.env.VITE_API_URL;

//Homepage data
export const getHomepageData = async () => {
  const res = await fetch(`${API_URL}/homepage`);

  if (!res.ok) {
    throw new Error(`Failed to fetch homepage: ${res.status}`);
  }

  return res.json();
};

//Manga Chapter data
export const getChapterData = async (mangaId, limit, offset) => {
  const res = await fetch(
    `${API_URL}/chapters/${mangaId}?limit=${limit}&offset=${offset}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch chapters");
  }

  return res.json();
};

//Manga Details
export const getMangaDetails = async (mangaId) => {
  const res = await fetch(`${API_URL}/manga/${mangaId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch manga details");
  }

  return res.json();
};

//Read Manga Pages
export const getMangaPages = async (chapterId) => {
    const res = await fetch(`${API_URL}/read/${chapterId}`, {
        cache: "no-store", // Ensure we always get fresh data
    });

    if(!res.ok) {
        throw new Error("Failed to fetch manga pages");
    }

    return res.json();
}

//Manga Images
export const getRandomImages = async (offset) => {

    const res = await fetch(
    `${API_URL}/random-manga?offset=${offset}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch random manga");
  }

  return res.json();
}

//Manga Recommendations
export const getRecommendations = async (mangaId) => {
  const res = await fetch(`${API_URL}/recommendations/${mangaId}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch manga details: ${res.status}`);
  }

  return res.json();
};

//Search Manga
export const searchManga = async (query) => {
  const res = await fetch(
    `${API_URL}/search?title=${encodeURIComponent(query)}&limit=5&includes[]=cover_art&includes[]=artist`
  );
  
  if (!res.ok) {
      throw new Error(`Failed to search manga: ${res.status}`);
    }
  return res.json();
};

;
