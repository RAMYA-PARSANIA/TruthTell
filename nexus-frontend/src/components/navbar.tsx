import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/images/logo.png";
import newsSourcesData from "@/pages/news_sources_en.json";

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
  const [topSources, setTopSources] = useState<NewsSource[]>([]);

  useEffect(() => {
    // Sort news sources by priority (lower number means higher priority)
    const sortedSources = [...newsSourcesData.results]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 10);
    
    setTopSources(sortedSources);
  }, []);

  // Add the styles to the document head when component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = blobAnimationStyles;
    document.head.appendChild(styleElement);

    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <nav className="absolute top-4 left-4 z-40">
        <div className="bg-slate-800/70 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center gap-4">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="TruthTell Logo" 
              className="h-8 w-8 rounded-full"
            />
            <span className="ml-2 text-sm font-bold text-white">TruthTell</span>
          </div>
          <div className="flex gap-2">
            <Link 
              to="/" 
              className="px-3 py-1 text-sm text-white rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/dashboard"
              className="px-3 py-1 text-sm text-white rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              Dashboard
            </Link>
            <motion.button
              onClick={toggleModal}
              className="px-3 py-1 text-sm text-white bg-[#3737bd] rounded-lg hover:bg-[#2d2da8] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Top Sources
            </motion.button>
          </div>
        </div>
      </nav>

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
              <div className="flex justify-between items-center p-4 border-b border-[#a54c72]/50">
                <motion.h2 
                  className="text-xl font-bold text-fuchsia-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Top 10 News Sources
                </motion.h2>
                <motion.button 
                  onClick={toggleModal}
                  className="text-fuchsia-300 hover:text-fuchsia-100 transition-colors"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <div className="p-4">
                <div className="grid gap-4">
                  {topSources.map((source, index) => (
                    <motion.div 
                      key={source.id} 
                      className="border border-[#a54c72]/50 rounded-lg p-4 hover:shadow-md transition-shadow bg-slate-800/50 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 30, 60, 0.6)" }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div 
                          className="bg-[#3737bd] rounded-full h-10 w-10 flex items-center justify-center text-white font-bold"
                          whileHover={{ scale: 1.1 }}
                        >
                          {index + 1}
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-lg text-fuchsia-200">{source.name}</h3>
                          <div className="text-sm text-fuchsia-300/70">Priority: {source.priority}</div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="text-sm font-semibold mb-1 text-blue-300">Languages:</div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {source.language.map(lang => (
                            <motion.span 
                              key={lang} 
                              className="px-2 py-1 bg-[#3737bd]/70 text-blue-100 text-xs rounded-full uppercase font-medium"
                              whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 55, 189, 0.9)" }}
                            >
                              {lang}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold mb-1 text-purple-300">Categories:</div>
                        <div className="flex flex-wrap gap-1">
                          {source.category.map(cat => (
                            <motion.span 
                              key={cat} 
                              className="px-2 py-1 bg-[#a54c72]/70 text-purple-100 text-xs rounded-full uppercase font-medium"
                              whileHover={{ scale: 1.05, backgroundColor: "rgba(165, 76, 114, 0.9)" }}
                            >
                              {cat}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
