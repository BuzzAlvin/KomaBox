import { useNavigate } from "react-router-dom";
import { proxyImage } from "../../api/mangadex";

const LatestBox = ({manga, variant}) => {
  const navigate = useNavigate();

  const handleClick = () => {
  if (manga.source === "latest" && manga.chapterId) {
    navigate(`/read/${manga.chapterId}`);
  } else {
    navigate(`/manga/${manga.id}`);
  }
};

// Format time function
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 1) return "Today";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};
  
  return (
    <div onClick={() => handleClick()} className="flex items-center gap-2 cursor-pointer"> 
        <img
          src={proxyImage(manga?.cover)}
          alt={manga?.title}
          className="w-18 sm:w-22 md:w-26 h-full aspect-3/4 object-cover rounded-md shadow-md"
          onError={(e) => {
            e.currentTarget.src = "/images/kilobyte.png";
          }}
        />

      <div className="flex flex-col gap-1.5 w-full">
        <h2
        className="text-sm sm:text-base md:text-lg font-bold">
          {manga?.title}
        </h2>
        <div className="flex flex-col ">
          <span className="text-xs sm:text-sm md:text-base">Latest: {`Chapter ${manga?.latestChapter}`}</span>

          {variant === "search" && manga?.firstChapter && (
            <span className="text-text-secondary text-xs sm:text-sm md:text-base">
              First: {`Chapter ${manga.firstChapter}`}
            </span>
          )}

          {variant === "search" && manga?.updatedAt && (
            <span className="text-text-secondary text-xs sm:text-sm md:text-base">
              Updated: {formatTime(manga.updatedAt)}
            </span>
          )}
        </div>
        <div className="flex justify-between text-xs sm:text-sm md:text-base">
          <span className="text-text-secondary">
           {manga?.artist}
          </span>

          {manga?.time && <span>{manga.time}</span>}
        </div>
      </div>
    </div>
  );
};

export default LatestBox;
