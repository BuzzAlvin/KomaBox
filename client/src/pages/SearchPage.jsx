import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import Loader from "../components/ui/Loader";
import LatestBox from "../components/ui/LatestBox";
import Footer from "../components/Layout/Footer";
import { useEffect } from "react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");

  const secQuery = query || localStorage.getItem("last-search-query");

  const { results, loading, error } = useSearch(secQuery);

  //Save to localStorage
  useEffect(() => {
    if (query) {
        localStorage.setItem("last-search-query", query);
    }
  },[query])

  return (
    <div className="min-h-screen flex flex-col ">
      <h2 className="text-sm sm:text-base md:text-lg lg:text-xl mb-8">Results for <span className="text-brand font-semibold">"{secQuery}"</span></h2>

      {loading && <Loader />}
      {error && <p>{error}</p>}

      {results.map((manga) => (
        <div 
        onClick={()=> naviagate()}
        key={manga.id} className="flex flex-col mb-4">
          <LatestBox manga={manga} variant="search" />
        </div>
      ))}
    {console.log("Query:", secQuery)}
      <Footer />
    </div>
  );
};

export default SearchPage;
