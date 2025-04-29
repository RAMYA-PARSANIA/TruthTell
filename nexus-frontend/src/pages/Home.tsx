import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaDatabase,
  FaBrain,
  FaGlobe,
  FaVideo,
  FaShieldAlt,
} from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import "./Home.css";
import Spline from "@splinetool/react-spline";
import Navbar from "@/components/navbar";

const Home = () => {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  const features = [
    {
      icon: <FaBolt className="text-4xl text-fuchsia-500" />,
      title: "Real-Time Detection",
      description:
        "Instant fact-checking during live broadcasts with millisecond response time",
    },
    {
      icon: <FaBrain className="text-4xl text-fuchsia-500" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning models trained on vast datasets for accurate verification",
    },
    {
      icon: <FaDatabase className="text-4xl text-fuchsia-500" />,
      title: "Knowledge Graph",
      description:
        "Comprehensive fact database with Neo4j for contextual understanding of information",
    },
    // {
    //   icon: <FaCheckCircle className="text-4xl text-fuchsia-500" />,
    //   title: "Truth Detection",
    //   description:
    //     "Sophisticated NLP algorithms for identifying misinformation patterns",
    // },
    {
      icon: <FaGlobe className="text-4xl text-fuchsia-500" />,
      title: "Multilingual Support",
      description:
        "Fact-checking across multiple languages to combat global misinformation",
    },
    {
      icon: <FaVideo className="text-4xl text-fuchsia-500" />,
      title: "Deepfake Detection",
      description:
        "Advanced computer vision to identify manipulated videos and images",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-fuchsia-500" />,
      title: "Misinformation Shield",
      description:
        "Proactive alerts to prevent the spread of false information",
    },
  ];

  const teamMembers = [
    {
      name: "Chaitya Shah",
      role: "Team Lead/Full Stack Engineer",
      description: "Oversees project management and full-stack development",
    },
    {
      name: "Krishna Sai V",
      role: "Developer Relations/DevOps",
      description: "Focuses on integration and deployment of AI models",
    },
    {
      name: "Ramya Parsania",
      role: "ML Engineer",
      description:
        "Built the NLP models for fact-checking and deepfake detection",
    },
    {
      name: "Krish Patel",
      role: "AI Engineer",
      description:
        "Works on developing and optimizing AI algorithms for various applications",
    },
    {
      name: "Satyam Ambi",
      role: "Web Dev Engineer",
      description:
        "Creates the user interface and ensures a seamless user experience",
    },
  ];

  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };

  const handleBackgroundLoad = () => {
    setBackgroundLoaded(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="h-screen relative">
          {!splineLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 z-10">
              <BiLoaderAlt className="animate-spin text-6xl text-fuchsia-500 mb-4" />
              <p className="text-white text-xl font-medium">
                Loading Experience...
              </p>
            </div>
          )}
          <Spline
            scene="https://prod.spline.design/gbC1n3NsKQP9dZdE/scene.splinecode"
            onLoad={handleSplineLoad}
            className={
              splineLoaded
                ? "opacity-100 transition-opacity duration-1000"
                : "opacity-0"
            }
          />
        </div>

        <motion.div
          className="p-8 relative"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="fixed inset-0 -z-10">
            {!backgroundLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900"></div>
            )}
            <Spline
              scene="https://prod.spline.design/X6jdVTy-ZKbG6qTK/scene.splinecode"
              onLoad={handleBackgroundLoad}
              className={
                backgroundLoaded
                  ? "opacity-100 transition-opacity duration-1000"
                  : "opacity-0"
              }
            />
          </div>

          {/* About Us Section */}
          <motion.div
            className="relative z-10 max-w-6xl mx-auto bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-fuchsia-500/30 shadow-xl mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white text-center">
              About Nexus of Truth
            </h2>
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              We are second-year students from IIIT Bangalore, passionate about
              building impactful AI solutions. At TruthTell hackathon, we
              developed Nexus of Truth — an AI-powered platform that detects
              deepfakes, fact-checks news articles, and flags misinformation in
              real time. With multilingual support and live-streaming alerts,
              our tool is designed to combat the spread of false information
              across digital platforms.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-fuchsia-500/20">
                <h3 className="text-xl font-bold text-fuchsia-400 mb-3">
                  Our Mission
                </h3>
                <p className="text-white/80">
                  To create a more informed digital ecosystem where truth
                  prevails over misinformation, empowering users to make
                  decisions based on verified facts rather than manipulated
                  content.
                </p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-fuchsia-500/20">
                <h3 className="text-xl font-bold text-fuchsia-400 mb-3">
                  Our Approach
                </h3>
                <p className="text-white/80">
                  We combine cutting-edge AI technologies including natural
                  language processing, computer vision, and knowledge graphs to
                  create a comprehensive fact-checking system that works across
                  multiple media formats.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center my-16 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Our platform leverages state-of-the-art technologies to deliver
              accurate and reliable fact-checking
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {[
                "TensorFlow",
                "PyTorch",
                "BERT",
                "Real-time broadcasting",
                "NLP",
                "Python",
                "React",
                "Fact-check API",
                "Neo4j",
                "Computer Vision",
                "Gemini AI",
                "Knowledge Graphs",
              ].map((tech, index) => (
                <motion.span
                  key={index}
                  className="px-4 py-2 bg-[#3737bd] text-white rounded-full text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, backgroundColor: "#4a4ad7" }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            <h2 className="text-4xl font-bold mb-12 text-white">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center content-center gap-8 my-16 relative z-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl border border-[#a54c72] bg-opacity-5 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(165, 76, 114, 0.4)",
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-slate-900/80 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center text-white">
                    {feature.title}
                  </h3>
                  <p className="text-center text-white/80">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            className="relative z-10 max-w-6xl mx-auto mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-white text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-[#a54c72] text-center"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-16 h-16 bg-fuchsia-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Input Content
                </h3>
                <p className="text-white/80">
                  Upload articles, videos, or connect to live streams for
                  real-time analysis
                </p>
              </motion.div>
              <motion.div
                className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-[#a54c72] text-center"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-16 h-16 bg-fuchsia-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  AI Analysis
                </h3>
                <p className="text-white/80">
                  Our algorithms extract claims, verify facts, and detect
                  manipulated media
                </p>
              </motion.div>
              <motion.div
                className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-[#a54c72] text-center"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-16 h-16 bg-fuchsia-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Results</h3>
                <p className="text-white/80">
                  Receive detailed reports with accuracy scores, evidence, and
                  explanations
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            className="relative z-10 max-w-6xl mx-auto mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-white text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-[#a54c72] text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(165, 76, 114, 0.4)",
                  }}
                >
                  <div className="w-20 h-20 bg-slate-700/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="text-2xl font-bold text-fuchsia-400">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-white">
                    {member.name}
                  </h3>
                  <p className="text-fuchsia-400 mb-3 text-sm">{member.role}</p>
                  <p className="text-white/80 text-sm">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          {/* <motion.div
            className="relative z-10 max-w-6xl mx-auto mb-16 bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-fuchsia-500/30 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white text-center">
              Impact & Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-fuchsia-400 mb-2">
                  95%
                </div>
                <p className="text-white/80">Accuracy in fact verification</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-fuchsia-400 mb-2">
                  10+
                </div>
                <p className="text-white/80">Supported languages</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-fuchsia-400 mb-2">
                  500ms
                </div>
                <p className="text-white/80">Average response time</p>
              </div>
            </div>
          </motion.div> */}

          {/* Call to Action */}
          <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center mb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Fight Misinformation?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join us in our mission to create a more truthful digital world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-fuchsia-600 text-white rounded-full font-medium text-lg hover:bg-fuchsia-700 transition-colors shadow-lg"
              >
                Try Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border-2 border-fuchsia-500 text-white rounded-full font-medium text-lg hover:bg-fuchsia-500/20 transition-colors shadow-lg"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="relative z-10 py-8 border-t border-fuchsia-500/30 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p className="text-white/60">
              © 2025 Nexus of Truth | Created by IIIT Bangalore Students
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Home;
