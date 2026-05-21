import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Tag from "./Tag";

const PopularCard = ({ handlePrev, handleNext, manga }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (manga.source === "latest" && manga.chapterId) {
      navigate(`/manga/${manga.id}/read/${manga.chapterId}`);
    } else {
      navigate(`/manga/${manga.id}`);
    }
  };
  return (
    <>
      <div
        onClick={() => handleClick()}
        className="flex sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full cursor-pointer"
      >
        {/* Manga Image */}
        <div className="shrink-0 w-40 sm:w-60 md:w-72">
          <img
            src={manga?.cover || "../images/logo.png"}
            alt={manga?.title || "Manga Cover"}
            className="w-full h-auto aspect-2/3 object-cover rounded-md shadow-md"
          />
        </div>

        {/* Manga Info */}
        <div className="flex flex-col justify-between flex-1 gap-4 p-1.5">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-base sm:text-lg md:text-xl">
              {manga?.title || "Manga Title"}
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2 sm:hidden">
              {manga?.tags?.map((tag, index) => (
                <Tag key={index} tag={tag} />
              ))}
            </div>

            {/* Description */}
            <p className="hidden sm:block sm:text-sm md:text-base text-text-secondary">
              {manga?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="block text-sm sm:text-base md:text-lg font-medium italic sm:hidden">
              {manga?.artist}
            </span>
            <div className="hidden w-full sm:flex justify-between gap-4 text-text-secondary text-2xl">
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
              >
                <FaArrowLeft />
              </button>
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopularCard;
