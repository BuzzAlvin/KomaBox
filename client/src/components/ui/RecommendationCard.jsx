import { useNavigate } from "react-router-dom";

const RecommendationCard = ({ manga }) => {
    const navigate = useNavigate();
  return (
    <div
    onClick={() => navigate(`/manga/${manga.id}`)}
    className="w-full cursor-pointer">
      <div className="relative ">
        <img
          src={manga.cover}
          alt={manga.title}
          className="block w-full aspect-2/3 object-cover rounded-lg"
          referrerPolicy="no-referrer"
        />

         {/* Overlay title (for recommendation) */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-2 rounded-lg">
          <p className="text-white text-xs sm:text-sm md:text-base line-clamp-2">
            {manga.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
