import { useState, useEffect } from "react";
import { useRandomImages } from "../hooks/useImages";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Loader from "../components/ui/Loader";
import Footer from "../components/Layout/Footer";

const ImagePage = () => {
  const [page, setPage] = useState(1);
  const { images, loading } = useRandomImages(page);
  const navigate = useNavigate();

  useEffect(() => {
  const main = document.querySelector("main");

  if (main) {
    main.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [page]);

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-3 sm:mb-3 md:mb-6">
        Manga Covers
      </h2>

      {loading && <Loader />}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="cursor-pointer hover:scale-105 transition"
            onClick={() => navigate(`/manga/${img.id}`)}
          >
            <img
              src={img.cover}
              alt={img.title}
              className="w-full aspect-3/4 object-cover rounded"
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="flex justify-center gap-4 mt-8 mb-6 sm:mb-8 md:mb-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 sm:px-4 py-2 bg-text-tertiary rounded ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-text-tertiary-hover"}`}
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">
              <FaAngleLeft />
            </span>
          </button>

          <span className="px-4 py-2 text-xs sm:text-sm md:text-base text-text-secondary">Page {page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-sm sm:text-base md:text-lg px-3 sm:px-4 py-2 bg-brand text-white rounded"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">
              <FaAngleRight />
            </span>
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ImagePage;
