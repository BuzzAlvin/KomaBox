const BOOKMARK_KEY = "komabox_bookmarks";

export const getBookmarks = () => {
    const stored = localStorage.getItem(BOOKMARK_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveBookmark = (manga) => {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(manga));
};

export const addBookmark = (manga) => {
  const bookmarks = getBookmarks();

  // prevent duplicates
  const exists = bookmarks.find((item) => item.id === manga.id);
  if (exists) return;

  const updated = [...bookmarks, manga];
  saveBookmark(updated);
};

export const removeBookmark = (id) => {
  const updated = getBookmarks().filter((m) => m.id !== id);
  saveBookmark(updated);
};

export const isBookmarked = (id) => {
  return getBookmarks().some((m) => m.id === id);
};