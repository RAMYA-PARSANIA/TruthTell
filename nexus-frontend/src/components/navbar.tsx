import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/images/logo.png";
import newsSourcesData from "@/pages/news_sources_en.json";
import {
  FaSearch,
  FaInfoCircle,
  FaChartBar,
  FaGlobe,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface NewsSource {
  id: string;
  name: string;
  url: string;
  icon: string | null;
  priority: number;
  description: string;
  category: string[];
  language: string[];
  country: string[];
  total_article: number;
  last_fetch: string;
}

// Add the CSS to your stylesheet or use this style element
const blobAnimationStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [topSources, setTopSources] = useState<NewsSource[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Sort news sources by priority (lower number means higher priority)
    const sortedSources = [...newsSourcesData.results]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 10);

    setTopSources(sortedSources);
  }, []);

  // Add the styles to the document head when component mounts
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = blobAnimationStyles;
    document.head.appendChild(styleElement);

    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Add scroll event listener to change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-4 bg-slate-900/90 backdrop-blur-md shadow-lg" : "py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={logo}
                  alt="TruthTell Logo"
                  className="h-10 w-10 rounded-full border-2 border-fuchsia-500"
                />
              </motion.div>
              <motion.span
                className="ml-2 text-lg font-bold text-white"
                whileHover={{ color: "#e879f9" }}
              >
                <Link to="/">Nexus of Truth</Link>
              </motion.span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-white hover:text-fuchsia-400 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-white hover:text-fuchsia-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-fuchsia-400 transition-colors font-medium"
              >
                About Us
              </Link>
              <motion.button
                onClick={toggleModal}
                className="px-4 py-2 text-white bg-gradient-to-r from-[#3737bd] to-[#a54c72] rounded-lg hover:opacity-90 transition-opacity font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Top Sources
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white p-2"
              >
                {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md pt-20 px-4"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-white text-xl py-4 border-b border-fuchsia-500/30 hover:text-fuchsia-400 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-white text-xl py-4 border-b border-fuchsia-500/30 hover:text-fuchsia-400 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className="text-white text-xl py-4 border-b border-fuchsia-500/30 hover:text-fuchsia-400 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                About Us
              </Link>
              <Link
                to="/technology"
                className="text-white text-xl py-4 border-b border-fuchsia-500/30 hover:text-fuchsia-400 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Technology
              </Link>
              <motion.button
                onClick={() => {
                  toggleModal();
                  setShowMobileMenu(false);
                }}
                className="mt-4 px-4 py-3 text-white bg-gradient-to-r from-[#3737bd] to-[#a54c72] rounded-lg hover:opacity-90 transition-opacity font-medium text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Top Sources
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal with AnimatePresence for enter/exit animations */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background overlay with animated gradient */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={toggleModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-[100px] opacity-30">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
                  <div className="absolute top-1/3 right-1/4 w-1/2 h-1/2 bg-blue-600 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-1/2 h-1/2 bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
                </div>
              </div>
            </motion.div>

            {/* Modal content */}
            <motion.div
              className="bg-slate-900/90 backdrop-blur-md rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto border border-[#a54c72] text-white relative z-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#a54c72]/50">
                <motion.h2
                  className="text-2xl font-bold text-gradient bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Top 10 Trusted News Sources
                </motion.h2>
                <motion.button
                  onClick={toggleModal}
                  className="text-fuchsia-300 hover:text-fuchsia-100 transition-colors"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-6 bg-slate-800/50 rounded-lg p-3 border border-[#a54c72]/30">
                  <FaSearch className="text-fuchsia-400" />
                  <input
                    type="text"
                    placeholder="Search sources..."
                    className="bg-transparent border-none outline-none text-white w-full placeholder-fuchsia-300/50"
                  />
                </div>

                <div className="grid gap-4">
                  {topSources.map((source, index) => (
                    <motion.div
                      key={source.id}
                      className="border border-[#a54c72]/50 rounded-lg p-4 hover:shadow-md transition-shadow bg-slate-800/50 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(30, 30, 60, 0.6)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          className="bg-gradient-to-br from-[#3737bd] to-[#a54c72] rounded-full h-12 w-12 flex items-center justify-center text-white font-bold shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {index + 1}
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-lg text-fuchsia-200">
                            {source.name}
                          </h3>
                          <div className="text-sm text-fuchsia-300/70 flex items-center gap-1">
                            <FaInfoCircle size={12} />
                            <span>Priority: {source.priority}</span>
                            <span className="mx-1">•</span>
                            <FaChartBar size={12} />
                            <span>
                              Articles: {source.total_article.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-semibold mb-1 text-blue-300 flex items-center gap-1">
                          <FaGlobe size={14} /> Languages:
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {source.language.map((lang) => (
                            <motion.span
                              key={lang}
                              className="px-2 py-1 bg-[#3737bd]/70 text-blue-100 text-xs rounded-full uppercase font-medium"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(55, 55, 189, 0.9)",
                              }}
                            >
                              {lang}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold mb-1 text-purple-300">
                          Categories:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {source.category.map((cat) => (
                            <motion.span
                              key={cat}
                              className="px-2 py-1 bg-[#a54c72]/70 text-purple-100 text-xs rounded-full uppercase font-medium"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(165, 76, 114, 0.9)",
                              }}
                            >
                              {cat}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <motion.a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1 w-fit"
                        whileHover={{ x: 5 }}
                      >
                        Visit website →
                      </motion.a>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-[#a54c72]/50 text-center text-sm text-fuchsia-300/70">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
