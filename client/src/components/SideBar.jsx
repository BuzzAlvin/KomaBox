import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaHeart,
  FaBookmark,
  FaSearch,
  FaImage,
  FaCog,
  FaMoon,
  FaSun,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SideBar = ({
  darkMode,
  setDarkMode,
  collapsed,
  setCollapsed,
  isOpen,
  setIsOpen,
}) => {
  const menuItems = [
    { name: "Home", icon: FaHome, path: "/" },
    { name: "Favorites", icon: FaHeart, path: "/favorites" },
    { name: "Bookmark", icon: FaBookmark, path: "/bookmark" },
    { name: "Search", icon: FaSearch, path: "/search" },
    { name: "Images", icon: FaImage, path: "/images" },
  ];

  const bottomMenu = [
    { name: "Settings", icon: FaCog, path: "/settings" },
    {
      name: darkMode ? "DarkMode" : "LightMode",
      icon: darkMode ? FaSun : FaMoon,
      action: () => setDarkMode(!darkMode),
    },
    { name: "Account", icon: FaUser },
  ];

  const renderMenu = (menu) =>
    menu.map((list, index) => {
      const Icon = list.icon;
      /* If the button has a path to another page */
      if (list.path) {
        return (
          <NavLink
            key={index}
            to={list.path}
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-2 text-text-primary  rounded-sm transition ${
                collapsed ? "justify-center" : "gap-1.5"
              } ${isActive ? "bg-brand text-text-secondary hover:bg-brand/70" : "hover:bg-hover"}`
            }
          >
            <Icon
              className={`${collapsed ? " sm:text-xl md:text-2xl" : "sm:text-lg md:text-xl "} ${isOpen ? "text-sm" : ""}`}
            />
            <span
              className={`${collapsed ? "sm:hidden" : "block text-sm md:text-base"} ${isOpen ? "text-sm" : ""}`}
            >
              {list.name}
            </span>
          </NavLink>
        );
      }

      /* If the button is for an action i.e. toggle button */
      return (
        <li
          key={index}
          className={`flex items-center p-2 text-text-primary cursor-pointer hover:bg-hover rounded-sm ${
            collapsed ? "justify-center" : "gap-1.5"
          }`}
          onClick={list.action}
          to={list.path}
        >
          <Icon
            className={`${collapsed ? "sm:text-xl md:text-2xl " : "sm:text-lg md:text-xl"}`}
          />
          <span
            className={`${collapsed ? "sm:hidden" : "block text-sm md:text-base"} ${isOpen ? "text-sm" : ""}`}
          >
            {list.name}
          </span>
        </li>
      );
    });

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-text-primary/40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`h-dvh overflow-y-auto bg-surface fixed sm:relative flex flex-col justify-between md:p-4 sm:p-3 p-2 shadow-md transition-all duration-300 z-50 ${
          collapsed ? "sm:w-20 md:w-24 " : "sm:w-48 md:w-64"
        }  ${isOpen ? "translate-x-0 w-1/2" : "-translate-x-full sm:translate-x-0"} `}
      >
        <div className="flex flex-col gap-1.5">
          {/* Mobile */}
          <div className="flex items-center gap-2 justify-between mb-6">
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

            {/* Hamburger Icon */}
            <button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className="p-2 rounded-full cursor-pointer hover:bg-hover dark:hover:bg-gray-700 transition sm:hidden"
            >
              <FaTimes />
            </button>
          </div>

          {/* Desktop & Tablets */}
          <div className="sm:flex items-center gap-2 justify-between mb-6 hidden">
            {/* Logo */}
            {collapsed ? (
              <img
                src="/images/logo.png"
                alt="KomaBox"
                className="w-8 h-8 rounded-lg "
              />
            ) : (
              <span className="flex gap-1.5">
                <img
                  src="/images/logo.png"
                  alt="KomaBox"
                  className="w-8 h-8 rounded-lg "
                />
                <h2 className="text-brand text-xl font-bold">KomaBox</h2>
              </span>
            )}
            <button
              className="p-2 rounded-full cursor-pointer hover:bg-hover dark:hover:bg-gray-700 transition"
              onClick={() => setCollapsed(!collapsed)}
            >
              <FaBars />
            </button>
          </div>

          {/* Menu */}
          <ul className="flex flex-col gap-1 ">{renderMenu(menuItems)}</ul>
        </div>

        <ul className="flex flex-col gap-1 ">{renderMenu(bottomMenu)}</ul>
      </aside>
    </>
  );
};

export default SideBar;
