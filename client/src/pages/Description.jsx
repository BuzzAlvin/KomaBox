import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMangaDetail } from "../hooks/useMangaDetail";
import { useChapter } from "../hooks/useChapter";
import { useRecommendations } from "../hooks/useRecommendation";
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "../utils/bookmarkStorage";

import {
  FaFlag,
  FaUpload,
  FaReadme,
  FaStar,
  FaBookmark,
  FaComment,
  FaSignInAlt,
} from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import Tag from "../components/ui/Tag";
import RecommendationCard from "../components/ui/RecommendationCard";
import Footer from "../components/Layout/Footer";
import Loader from "../components/ui/Loader";
const Description = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();

  const { chapters, loading: chapterLoading } = useChapter(mangaId);

  //Fetch recommendation when tab is active
  const {
    recommendations,
    loading: recLoading,
    error: recError,
    fetchRecommendations,
  } = useRecommendations(mangaId);

  const firstChapter = chapters?.[0];

  const {
    title,
    description,
    altTitle,
    ratings,
    follows,
    tags,
    cover,
    author,
    artist,
    loading,
    error,
    status,
  } = useMangaDetail(mangaId);
  /* Bookmark state */
  const [bookmarked, setBookmarked] = useState(false);

  /* active tab */
  const [active, setActive] = useState("chapters");

  /* show more button on description */
  const [showButton, setShowButton] = useState(false);

  /* Expanded state */
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef(null);

  // handle click when recommendations tab becomes active
  const handleTabClick = (tab) => {
    setActive(tab);
    if (tab === "recommendations") {
      fetchRecommendations();
    }
  };

  // Reset tab when manga changes
  useEffect(() => {
    setActive("chapters");
  }, [mangaId]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const isOverflowing = el.scrollHeight > el.clientHeight;
      setShowButton(isOverflowing);
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [description]);

  /* bookmark mount effect */
  useEffect(() => {
    setBookmarked(isBookmarked(mangaId));
  }, [mangaId]);

  if (loading) return <Loader className="h-full" />;

  return (
    <section>
      <div className="relative w-full h-50 backdrop-blur-md">
        <img src={cover} alt={title} className="w-full h-full object-cover" />

        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-xs bg-black/30"></div>

        {/* Description header */}
        <div className="flex gap-1 sm:gap-1.5 md:gap-2.5 lg:gap-3 h-40 w-full absolute top-16 px-2 sm:px-3 md:px-4">
          {/* Left column (fixed width title box) */}
          <div className="w-28 sm:w-36 md:w-40 shrink-0">
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover rounded-sm "
            />
          </div>

          {/* Right column (fills remaining space) */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-col justify-between gap-4 flex-2 p-1 text-text-secondary">
              <div className="flex flex-col ">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base lg:text-xl font-medium">
                  {altTitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm md:text-base font-medium">
                {artist}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-1 text-text-primary ">
              <div
                onClick={() => {
                  if (bookmarked) {
                    removeBookmark(mangaId);
                    setBookmarked(false);
                  } else {
                    const bookmarkData = {
                      id: mangaId,
                      title,
                      description,
                      cover,
                    };
                    addBookmark(bookmarkData);
                    setBookmarked(true);
                  }
                }}
              >
                <button
                  className={`bg-brand rounded-sm p-2 font-semibold text-xs sm:text-sm md:text-base hover:bg-brand/80 cursor-pointer hidden sm:block ${bookmarked ? "bg-text-tertiary hover:bg-text-tertiary/80" : "bg-brand"}`}
                >
                  Add To Library
                </button>

                <button
                  className={`bg-brand rounded-sm p-2 font-semibold text-xs sm:text-sm md:text-base hover:bg-brand/80 cursor-pointer sm:hidden ${bookmarked ? "bg-text-tertiary hover:bg-text-tertiary/80" : "bg-brand"}`}
                >
                  <FaBookmark />
                </button>
              </div>
              <button
                disabled={!chapters?.length}
                onClick={() => {
                  if (firstChapter) {
                    navigate(`/manga/${mangaId}/read/${firstChapter.id}`);
                  }
                }}
                className="rounded-sm bg-text-tertiary p-2 text-xs sm:text-sm md:text-base hover:bg-text-tertiary/80 cursor-pointer  md:block"
              >
                <FaReadme />
              </button>

              <button className="rounded-sm bg-text-tertiary p-2 text-xs sm:text-sm md:text-base hover:bg-text-tertiary/80 cursor-pointer hidden md:block">
                <FaFlag />
              </button>

              <button className="rounded-sm bg-text-tertiary p-2 text-xs sm:text-sm md:text-base hover:bg-text-tertiary/90 cursor-pointer hidden md:block">
                <FaUpload />
              </button>

              <button className="rounded-sm bg-text-tertiary p-2 text-xs sm:text-sm md:text-base hover:bg-text-tertiary/90 cursor-pointer md:hidden">
                <FiMoreHorizontal />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tags and rating with comments */}
      <div className="mt-8 ">
        <div className="flex flex-row gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 px-2 sm:px-3 md:px-4">
          <div className="sm:w-40 shrink-0"></div>
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
            <div className="flex flex-wrap flex-1 min-w-0 items-center gap-0.5 sm:gap-1">
              {tags.map((tag) => (
                <Tag key={tag.id} tag={tag.name} />
              ))}
            </div>
            <div className="flex flex-wrap flex-1 min-w-0 items-center gap-1.5 sm:gap-2">
              <span className="flex items-center gap-1 md:gap-1.5 text-xs sm:text-sm text-brand cursor-pointer">
                <FaStar /> {ratings.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 md:gap-1.5 text-xs sm:text-sm text-text-primary cursor-pointer">
                <FaBookmark /> {follows.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 md:gap-1.5 text-xs sm:text-sm text-text-primary cursor-pointer">
                <FaComment /> 17
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ABout Manga */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-2 mt-5 px-2 sm:px-3 md:px-4">
        <div className="flex  gap-1 sm:flex-col md:flex-row items-center">
          <h3 className="text-sm sm:text-base md:text-lg font-bold">Author:</h3>
          <p className="bg-text-tertiary text-xs sm:text-sm md:text-base px-0.5 rounded-sm">
            {author}
          </p>
        </div>
        <div className="flex  gap-1 sm:flex-col md:flex-row items-center">
          <h3 className="text-sm sm:text-base md:text-lg font-bold">Artist:</h3>
          <p className="bg-text-tertiary text-xs sm:text-sm md:text-base px-0.5 rounded-sm">
            {artist}
          </p>
        </div>
        <div className="flex  gap-1 sm:flex-col md:flex-row items-center">
          <h3 className="text-sm sm:text-base md:text-lg font-bold">Genre:</h3>
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <p
                key={tag.id}
                className="bg-text-tertiary text-xs sm:text-sm md:text-base px-0.5 rounded-sm"
              >
                {tag.name}
              </p>
            ))}
          </div>
        </div>
        <div className="flex  gap-1 sm:flex-col md:flex-row items-center">
          <h3 className="text-sm sm:text-base md:text-lg font-bold">Status:</h3>
          <a className="bg-text-tertiary text-xs sm:text-sm md:text-base px-0.5 rounded-sm">
            {status}
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col px-3 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-8">
        <p
          ref={textRef}
          className={` text-text-primary text-xs sm:text-sm md:text-base ${expanded ? "" : "line-clamp-3"}`}
        >
          {description}
        </p>
        {showButton && (
          <button
            className={`font-bold text-brand text-xs sm:text-sm mt-2 hover:underline}`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      <div className="mb-4 mt-2">
        <div className="overflow-x-auto fill-width">
          {/* Tabs */}
          <div className="px-2 sm:px-3 md:px-4 mt-8">
            <div className="flex items-center gap-6 sm:gap-10 md:gap-14 px-2 transition-all duration-300">
              {["chapters", "comments", "recommendations"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`pb-2 capitalize cursor-pointer ${
                    active === tab
                      ? "border-b-2 border-brand text-brand"
                      : "text-text-secondary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* CHAPTERS */}
            {active === "chapters" && (
              <>
                {/* loading and error states */}
                {/* Chapters/ Comments/ Related  Header*/}
                <div className="grid grid-cols-[2fr_1fr_1fr] text-brand font-semibold mt-4 px-3 sm:px-4 md:px-6 border-b border-brand pb-1.5 sm:pb-2">
                  <h6 className=" text-sm sm:text-base md:text-lg">Chapter</h6>
                  <h6 className="text-sm sm:text-base md:text-lg">
                    Chapter Title
                  </h6>
                  <h6 className="text-sm sm:text-base md:text-lg">
                    Time Uploaded
                  </h6>
                </div>
                {/* Chapters */}
                <div className=" mt-4 px-2 sm:px-3 md:px-5 max-h-96 overflow-y-auto border-b border-brand pt-5 bg-surface">
                  {chapterLoading ? (
                    <Loader />
                  ) : chapters.length === 0 ? (
                    <p className="text-xs sm:text-sm md:text-base text-center py-8 text-red-500">
                      No Chapters Available
                    </p>
                  ) : (
                    chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        onClick={() =>
                          navigate(`/manga/${mangaId}/read/${chapter.id}`)
                        }
                        className="grid grid-cols-[2fr_1fr_1fr] gap-1 text-xs sm:text-sm md:text-base py-1 cursor-pointer"
                      >
                        <p>Chapter {chapter.number}</p>
                        <p>{chapter.title}</p>
                        <p>{chapter.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* COMMENTS */}
            {active === "comments" && (
              <>
                <div className="flex items-center justify-between mt-8">
                  <p className="text-sm sm:text-base md:text-lg font-semibold">
                    1 comment
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <p>Sort by</p>
                    <select
                      name="comments"
                      id="comments"
                      className="bg-surface text-text-primary text-xs sm:text-sm md:text-base rounded-sm px-1"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </div>
                </div>

                {/* Comment Box */}
                <div className="bg-surface mt-8 border rounded-lg">
                  <div className="flex justify-between items-center py-3 px-3 sm:py-5 sm:px-4 md:py-6 md:px-6 border-b">
                    <p className="text-sm sm:text-base md:text-lg">
                      Log in to join the conversation
                    </p>{" "}
                    <button className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-brand hover:text-brand/85 cursor-pointer">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                        <FaSignInAlt />
                      </span>
                      Login
                    </button>
                  </div>
                  <div className="py-3 px-3 sm:py-5 sm:px-4 md:py-6 md:px-6">
                    <p className="text-sm sm:text-base md:text-lg">
                      Join the discussion...
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* RECOMMENDATIONS */}
            {active === "recommendations" && (
              <div className="my-8 px-2 sm:px-3 md:px-4 w-full">
                <p className="text-sm sm:text-base md:text-lg mb-2 sm:mb-4 md:mb-6 font-semibold">
                  Recommendations are ordered by similarity to this title.
                </p>
                {/* loading and error states */}
                {recLoading && (
                  <Loader className="flex items-center justify-center" />
                )}

                {recError && (
                  <p className="text-xs sm:text-sm md:text-base text-center py-8 text-red-500">
                    {recError}
                  </p>
                )}

                {!recLoading && !recError && recommendations.length === 0 && (
                  <p className="text-xs sm:text-sm md:text-base text-center py-8">
                    No recommendations available.
                  </p>
                )}

                {!recLoading && !recError && recommendations.length > 0 && (
                  <div className="mt-3 text-text-primary">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-1 sm:gap-2 md:gap-3">
                      {recommendations.map((rec) => (
                        <RecommendationCard
                          key={rec.id}
                          manga={rec}
                          variant="overlay"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mt-10 md:mt-16">
        <Footer />
      </div>
    </section>
  );
};

export default Description;
