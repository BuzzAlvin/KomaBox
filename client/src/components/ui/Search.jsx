import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSearch } from "../../hooks/useSearch";
import { FaSearch } from "react-icons/fa";
import Loader from "./Loader";

const Search = () => {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const navigate = useNavigate();
  const { results, loading } = useSearch(input);

  useEffect(() => {
    if (isClicked && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 150);
    }
  }, [isClicked]);

  //close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim().length > 1) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (id) => {
    setShowDropdown(false);
    setInput("");
    navigate(`/manga/${id}`);
  };
  //handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    navigate(`/search?q=${input}`);
    setInput("");
    setIsClicked(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <form
        className="bg-text-tertiary sm:p-1 md:p-1.5 rounded-sm flex items-center m-1 overflow-hidden"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          type="search"
          placeholder="Search..."
          value={input}
          onBlur={() => {
            if (input === "") setIsClicked(false);
          }}
          className={`text-text-primary outline-none placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg transition-[width] duration-300 ease-in-out sm:flex-1 sm:opacity-100 sm:ml-2 sm:max-w-full sm:px-2
                ${
                  isClicked
                    ? " opacity-100 ml-2 max-w-32 px-2"
                    : "max-w-0 opacity-0 ml-0 px-0"
                }
  `}
          onChange={handleChange}
        />

        <button
          type={isClicked ? "submit" : "button"}
          className="w-7 h-7 flex items-center justify-center shrink-0 cursor-pointer"
          onClick={() => {
            if (window.innerWidth < 640) {
              setIsClicked(!isClicked);
            }
          }}
        >
          <FaSearch className="text-text-primary font-light" />
        </button>
      </form>

      {/* ✅ Dropdown */}
      {showDropdown && (
        <div className="absolute w-full bg-surface mt-1 rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
          {loading && (
            <div className="p-4">
              <Loader />
            </div>
          )}

          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-text-secondary">No results found</p>
          )}

          {!loading &&
            results.map((manga) => (
              <div
                key={manga.id}
                onClick={() => handleSelect(manga.id)}
                className="flex items-center gap-3 p-3 hover:bg-text-tertiary/20 cursor-pointer"
              >
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="w-10 h-14 object-cover rounded"
                />
                <div>
                  <p className="text-xs md:text-sm font-medium">{manga.title}</p>
                  <p className="text-xs md:text-sm text-text-secondary">
                     {`Chapter ${manga.latestChapter}`}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
