import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Bookmark from "./pages/Bookmark";
import Description from "./pages/Description";
import Read from "./pages/Read";
import SearchPage from "./pages/SearchPage";
import Images from "./pages/Images";

function App() {
  /* Hamburger icon */
  const [isOpen, setIsOpen] = useState(false);
  /* Dark Mode */
  const [darkMode, setDarkMode] = useState(false);
  /* Sidebar Toggle */
  const [collapsed, setCollapsed] = useState(false);

  const mainRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
  setIsOpen(false);
}, [location.pathname]);

  /* Scroll to top */
const ScrollToTop = ({ mainRef }) => {
  const location = useLocation();

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.key]);

  return null;
};

  /* Dark Mode */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      <ScrollToTop mainRef={mainRef} />
      <div className="flex h-screen bg-bg overflow-hidden">
        <SideBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />
          <main
            ref={mainRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 mt-12 sm:mt-0"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/manga/:mangaId/read/:chapterId"
                element={<Read />}
              />
              <Route path="/manga/:mangaId" element={<Description />} />
              <Route path="/bookmark" element={<Bookmark />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/images" element={<Images />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
