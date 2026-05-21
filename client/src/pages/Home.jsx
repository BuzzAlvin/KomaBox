import { useState, useEffect } from "react";
import { useHomepage } from "../hooks/useHomepage";
import { motion, AnimatePresence } from "framer-motion";

/* Components */
import { FaArrowRight, FaArrowUp, FaArrowDown } from "react-icons/fa";
import HomepageCard from "../components/ui/HomepageCard";
import LatestBox from "../components/ui/LatestBox";
import Footer from "../components/Layout/Footer";
import PopularCard from "../components/ui/PopularCard";
import Loader from "../components/ui/Loader";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [showLatest, setShowLatest] = useState(false);

  /* Hooks */
  const { data, loading, error } = useHomepage();

  /* Timer for Popular Manga */
  useEffect(() => {
    if ((!loading && !data.popular.length) || hover) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.popular.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [data.popular, hover, loading]);

  if (loading) return <Loader className="h-full" />;
  if (error) return <p>{error}</p>;

  /* prev button */
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.popular.length - 1 : prevIndex - 1,
    );
  };

  /* next button */
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.popular.length);
  };

  /* Image on Slides */
  const currentManga = data.popular[currentIndex];

  /* Popular images slides on mobile */
  let touchStartX = 0;
  let touchEndX = 0;

  /* latest Logic */
  const visibleLatest = showLatest ? data.latest : data.latest.slice(0, 5);

  return (
    <main>
      <div className="p-2 sm:p-3 md:p-4 text-text-primary">
        <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2.5 sm:mb-4 md:mb-6">
          Popular Manga
        </h4>
        {/* Manga Card */}
        <div
          onTouchStart={(e) => (touchStartX = e.changedTouches[0].screenX)}
          onTouchEnd={(e) => {
            touchEndX = e.changedTouches[0].screenX;

            if (touchStartX - touchEndX > 50) {
              // swipe left
              setCurrentIndex((prev) => (prev + 1) % data.popular.length);
            }

            if (touchEndX - touchStartX > 50) {
              // swipe right
              setCurrentIndex((prev) =>
                prev === 0 ? data.popular.length - 1 : prev - 1,
              );
            }
          }}
          className="p-2 bg-surface rounded-md shadow-md text-text-primary overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentManga?.id}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
              className="flex gap-2 sm:gap-3 md:gap-4 w-full "
            >
              {/* display popular cards */}
              <PopularCard
                handleNext={handleNext}
                handlePrev={handlePrev}
                manga={currentManga}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Latest Update */}
      <div className=" flex flex-col mb-8">
        <div className="flex justify-between mb-2.5 sm:mb-4 md:mb-6">
          <h4 className="text-lg sm:text-xl md:text-2xl text-text-primary font-semibold">
            Latest Updates
          </h4>
          <button onClick={() => setShowLatest((prev) => !prev)}>
            {showLatest ? <FaArrowUp /> : <FaArrowDown />}
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-surface rounded-md shadow-md text-text-primary">
          {visibleLatest.map((manga) => {
            return <LatestBox key={manga.id} manga={manga} />;
          })}
        </div>
      </div>

      {/* Recommended Sections */}
      <div className=" flex flex-col mb-8">
        <div className="flex justify-between mb-2.5 sm:mb-4 md:mb-6">
          <h4 className="text-lg sm:text-xl md:text-2xl text-text-primary font-semibold">
            Recommended
          </h4>
          <button>
            <FaArrowRight />
          </button>
        </div>

        <div className="p-2 bg-surface rounded-md shadow-md text-text-primary overflow-hidden">
          <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto w-full scroll-smooth">
            {data.trending.map((manga) => (
              <HomepageCard key={manga.id} manga={manga} />
            ))}
          </div>
        </div>
      </div>

      {/* Self-Published Sections */}
      <div className=" flex flex-col mb-8">
        <div className="flex justify-between mb-2.5 sm:mb-4 md:mb-6">
          <h4 className="text-lg sm:text-xl md:text-2xl text-text-primary font-semibold">
            Self-Published
          </h4>
          <button>
            <FaArrowRight />
          </button>
        </div>

        <div className="p-2 bg-surface rounded-md shadow-md text-text-primary overflow-hidden">
          <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto w-full scroll-smooth">
            {data.popular.map((manga) => (
              <HomepageCard key={manga.id} manga={manga} />
            ))}
          </div>
        </div>
      </div>

      {/* Recently Added Sections */}
      <div className=" flex flex-col mb-8">
        <div className="flex justify-between mb-2.5 sm:mb-4 md:mb-6">
          <h4 className="text-lg sm:text-xl md:text-2xl text-text-primary font-semibold">
            Recently Added
          </h4>
          <button>
            <FaArrowRight />
          </button>
        </div>

        <div className="p-2 bg-surface rounded-md shadow-md text-text-primary overflow-hidden w-full">
          <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scroll-smooth">
            {data.latest.map((manga) => {
              return <HomepageCard key={manga.id} manga={manga} />;
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-16">
        <Footer />
      </div>
    </main>
  );
};

export default Home;
