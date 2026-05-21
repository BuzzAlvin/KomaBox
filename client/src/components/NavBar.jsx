import { FaUser, FaBars } from "react-icons/fa";
import Search from "./ui/Search";

const NavBar = ({ isOpen, setIsOpen }) => {
  return (
    <header className="bg-bg h-12 sm:h-14 md:h-16 flex items-center justify-between gap-4 sm:justify-end border-b border-brand px-1 sm:px-0 fixed top-0 w-full sm:relative">
      <div className="flex items-center gap-2 mr-3 sm:hidden">
        {/* Hamburger Icon */}
        <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full cursor-pointer hover:bg-hover dark:hover:bg-gray-700 transition">
          <FaBars />
        </button>

        {/* Logo */}
        <span className="flex items-center gap-1 sm:hidden">
          <img
            src="/images/logo.png"
            alt="KomaBox"
            className="w-6 h-6 rounded-lg "
          />
          <h2 className="text-brand md:text-xl sm:text-lg text-base font-bold">
            KomaBox
          </h2>
        </span>
      </div>

      <span className="flex items-center gap-1.5 pr-2 sm:gap-2 sm:pr-4 md:pr-6">
            <Search />
            <span className="bg-text-tertiary rounded-full p-1.5 sm:p-2 md:p-2.5 cursor-pointer">
          <FaUser className="text-sm sm:text-base md:text-lg" />
        </span>
      </span>
    </header>
  );
};

export default NavBar;
