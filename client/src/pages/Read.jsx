import { useParams, Link, useNavigate } from "react-router-dom";
import { useReadManga } from "../hooks/useReadManga";
import { useChapter } from "../hooks/useChapter";
import { useMangaDetail } from "../hooks/useMangaDetail";

import { FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ReadSelect from "../components/ui/ReadSelect";
import Footer from "../components/Layout/Footer";

const Read = () => {
  const { mangaId, chapterId } = useParams();
  const { pages, loading: pagesLoading } = useReadManga(chapterId);
  const { chapters } = useChapter(mangaId);
  //Title of manga
  const { title } = useMangaDetail(mangaId);

  //navigate hook for select chapter
  const navigate = useNavigate();

  const handleChange = (value) => {
    navigate(`/manga/${mangaId}/read/${value}`);
  };

  // Next and Prev Logic
  if (!chapters || chapters.length === 0) return null;

  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  if (currentIndex === -1) return <p>Chapter not found</p>;

  const currentChapter = chapters[currentIndex];

  const nextChapter =
    currentIndex !== -1 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;

  return (
    <section>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 md:gap-2 text-xs sm:text-base md:text-lg text-text-primary mb-2 sm:mb-3 md:mb-4 px-1 sm:px-1.5 md:px-2 py-2 sm:py-3 md:py-4 bg-brand">
        <Link 
        to={"/"}
        className="flex items-center gap-0.5 sm:gap-1 md:gap-2 hover:underline transition capitalize cursor-pointer">
          Manga Online
          <span className="text-xs sm:text-sm md:text-base">
            <FaAngleDoubleRight />
          </span>
        </Link>

        <Link
          to={`/manga/${mangaId}`}
          className="flex items-center gap-0.5 sm:gap-1 md:gap-2 hover:underline capitalize cursor-pointer"
        >
          {title}
          <span className="text-xs sm:text-sm md:text-base">
            <FaAngleDoubleRight />
          </span>
        </Link>

        <Link className="flex items-center hover:underline capitalize cursor-pointer">
          chapter {currentChapter?.number ??  "?"}
        </Link>
      </div>
      {/* Options */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3.5 md:mb-4 ">
        <ReadSelect
          chapters={chapters}
          currentChapter={currentChapter}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2 uppercase ">
          <a
            onClick={() =>
              prevChapter &&
              navigate(`/manga/${mangaId}/read/${prevChapter.id}`)
            }
            className="bg-surface text-text-primary text-[11px] sm:text-[13px] md:text-[15px] hover:bg-text-tertiary/30 py-1 px-1 sm:py-1.5 sm:px-1.5 md:py-2 md:px-2 letter cursor-pointer"
          >
            prev chapter
          </a>
          <a
            onClick={() => navigate(`/`)}
            className="bg-text-tertiary text-bg text-[11px] sm:text-[13px] md:text-[15px] hover:bg-text-tertiary/80 py-1 px-1 sm:py-1.5 sm:px-1.5 md:py-2 md:px-2 cursor-pointer"
          >
            go home
          </a>
          <a
            onClick={() =>
              nextChapter &&
              navigate(`/manga/${mangaId}/read/${nextChapter.id}`)
            }
            className="bg-brand text-bg text-[11px] sm:text-[13px] md:text-[15px] hover:bg-brand/80 py-1 px-1 sm:py-1.5 sm:px-1.5 md:py-2 md:px-2 cursor-pointer"
          >
            next chapter
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="mt-16 sm:mt-24 md:mt-32 lg:mt-36">
        <div className="flex flex-col items-center bg-surface p-2 sm:p-3 md:p-5 rounded-md shadow-md text-text-primary">
          {/* Chapter Title */}
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 capitalize text-brand">
            {title} {`Chapter ${currentChapter?.number ?? "?"}`}
          </h2>
          {/* Chapter Description */}
          <p className="text-sm sm:text-base md:text-lg">
            You're reading{" "}
            <span className="font-semibold">
              {title} {`Chapter ${currentChapter?.number ?? "?"}`}{" "}
            </span>{" "}
            at KomaBox.
          </p>
          <p className="text-sm sm:text-base md:text-lg space-y-4 text-center">
            Click the 🌟 Bookmark button now to stay updated on the latest
            chapters on KomaBox!💡Press F11 button to read manga in
            full-screen(PC-only). It will be so grateful if you let KomaBox be
            your favorite manga site. We hope you'll come join us and become a
            manga reader in this community! Have a beautiful day!
          </p>
        </div>

        {/* Image Container */}
        <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10">
          {/* Placeholder for manga image */}
          <div className="bg-surface rounded-xl w-full h-full flex items-center justify-center">
            <div key={chapterId} className="flex flex-col">
              {pagesLoading || pages.length === 0 ? (
                <div className="flex flex-col gap-4 w-full max-w-3xl animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-100 bg-gray-300 rounded-md"
                    />
                  ))}
                </div>
              ) : (
                pages.map((page, index) => (
                  <img
                    key={index}
                    src={page}
                    alt={title}
                    className="w-full max-w-3xl"
                  />
                ))
              )}
            </div>
          </div>
          {/* Next and Prev */}
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-8 md:mt-14">
            <a
              onClick={() =>
                navigate(`/manga/${mangaId}/read/${prevChapter.id}`)
              }
              className="bg-brand hover:bg-brand/80 flex items-center px-0.5 sm:px-1 md:*:px-1.5 rounded-md "
            >
              <button
                onClick={() =>
                  prevChapter &&
                  navigate(`/manga/${mangaId}/read/${prevChapter.id}`)
                }
                className="hidden md:block text-sm md:text-lg uppercase cursor-pointer"
              >
                previous chapter
              </button>
              <button className=" flex items-center p-2 sm:p-3 text-base sm:text-lg cursor-pointer md:hidden">
                <FaAngleLeft />
              </button>
            </a>
            <a
              onClick={() =>
                navigate(`/manga/${mangaId}/read/${nextChapter.id}`)
              }
              className="bg-brand hover:bg-brand/80 flex items-center px-0.5 sm:px-1 md:px-1.5 rounded-md uppercase"
            >
              <button
                onClick={() =>
                  nextChapter &&
                  navigate(`/manga/${mangaId}/read/${nextChapter.id}`)
                }
                className="hidden md:block md:text-lg cursor-pointer uppercase"
              >
                next chapter
              </button>

              <button className="flex justify-center items-center text-base sm:text-lg p-2 sm:p-3 md:hidden cursor-pointer">
                <FaAngleRight className="flex justify-center items-center " />
              </button>
            </a>
          </div>
        </div>
        {/* Footer */}
        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 md:gap-2 text-xs sm:text-base md:text-lg text-text-primary mb-2 sm:mb-3 md:mb-4 px-1 sm:px-1.5 md:px-2 py-2 sm:py-3 md:py-4 bg-brand mt-8 sm:mt-10 md:mt-16">
          <Link
            to="/"
            className="flex items-center gap-0.5 sm:gap-1 md:gap-2 hover:underline transition capitalize cursor-pointer"
          >
            Manga Online
            <span className="text-xs sm:text-sm md:text-base">
              <FaAngleDoubleRight />
            </span>
          </Link>

          <Link
            to={`/manga/${mangaId}`}
            className="flex items-center gap-0.5 sm:gap-1 md:gap-2 hover:underline capitalize cursor-pointer"
          >
            {title}
            <span className="text-xs sm:text-sm md:text-base">
              <FaAngleDoubleRight />
            </span>
          </Link>
          <Link className="flex items-center hover:underline capitalize cursor-pointer">
            chapter {currentChapter?.number}
          </Link>
        </div>
        {/* Options */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3.5">
          <ReadSelect
            chapters={chapters}
            currentChapter={currentChapter}
            onChange={handleChange}
          />

          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 uppercase">
            <a
              onClick={() =>
                prevChapter &&
                navigate(`/manga/${mangaId}/read/${prevChapter.id}`)
              }
              className="bg-surface text-text-primary text-[11px] sm:text-[13px] md:text-[15px] hover:bg-text-tertiary/30 py-1 px-1 sm:py-1.5 sm:px-1.5 md:py-2 md:px-2"
            >
              prev chapter
            </a>
            <a
              onClick={() => navigate(`/`)}
              className="bg-text-tertiary text-bg text-[11px] sm:text-[13px] md:text-[15px] hover:bg-text-tertiary/80 py-1 px-1 sm:py-1.5 sm:px-1.5 md:py-2 md:px-2"
            >
              go home
            </a>
            <a
              onClick={() =>
                nextChapter &&
                navigate(`/manga/${mangaId}/read/${nextChapter.id}`)
              }
              className="bg-brand text-bg text-[11px] sm:text-[13px] md:text-[15px] hover:bg-brand/80 py-1 px-1 sm:py-1.5 sm:px-1.5 md:py-2 md:px-2"
            >
              next chapter
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-14 md:mt-25">
        <Footer />
      </div>
    </section>
  );
};

export default Read;
