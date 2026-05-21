import { useNavigate } from "react-router-dom";

const HomepageCard = ({ manga }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (manga.source === "latest" && manga.chapterId) {
      navigate(`/manga/${manga.id}/read/${manga.chapterId}`);
    } else {
      navigate(`/manga/${manga.id}`);
    }
  };
  return (
    <div
    onClick={() => handleClick()}
    className="w-32 sm:w-40 md:w-48 cursor-pointer shrink-0"
  >
    <div className="relative">
      <img
        src={manga?.cover}
        alt={manga?.title}
        className="w-full h-auto aspect-2/3 object-cover rounded-md shadow-md"
      />
    </div>

    {/* Title below for homepage and pages with image title below */}
    <span className="mt-1 sm:mt-1.5 md:mt-2 text-xs sm:text-sm line-clamp-2 flex flex-wrap">
      {manga?.title}
    </span>
  </div>
);
};

/* w-32 sm:w-40 md:w-60 */
export default HomepageCard;
