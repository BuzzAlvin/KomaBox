import { useState, useEffect } from "react";
import { getBookmarks, removeBookmark } from "../utils/bookmarkStorage";
import { useNavigate } from "react-router-dom";

import { FaTrash } from "react-icons/fa";
import Footer from "../components/Layout/Footer";

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (id) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  return (
    <div className="flex flex-col justify-between p-3 sm:p-4 md:p-6 h-full">
        <div>
      <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-3 sm:mb-3 md:mb-6">My Bookmarks</h2>

      {bookmarks.length === 0 && <p>No bookmarks yet.</p>}
      <div className="grid gap-2 md:grid-cols-2 sm:gap-3 md:gap-4">


        {bookmarks.map((manga) => (
          <div key={manga.id} className="flex gap-1.5 sm:gap-2.5 md:gap-4 cursor-pointer">
            <img
              src={manga.cover}
              alt={manga.title}
              className="w-20 h-28 object-cover rounded"
              onClick={() => navigate(`/manga/${manga.id}`)}
            />

            <div className="flex flex-col justify-between">
              <div onClick={() => navigate(`/manga/${manga.id}`)}>
                <h3 className="text-sm sm:text-base md:text-lg font-bold">{manga.title}</h3>
                <p className="text-xs sm:text-sm md:text-base line-clamp-2">{manga.description}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(manga.id);
                }}
                className="text-red-500 text-sm sm:text-base md:text-lg mt-2 cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

        </div>
      <Footer />
    </div>
  );
};

export default Bookmark;
