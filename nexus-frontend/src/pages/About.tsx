import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const About = () => {
  // Team members data

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#1a1a3a] to-gray-900">
        {/* Hero Section */}
        <motion.div
          className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -inset-[100px] opacity-30">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
              <div className="absolute top-1/3 right-1/4 w-1/2 h-1/2 bg-blue-600 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-1/4 right-1/3 w-1/2 h-1/2 bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
            </div>
          </div>

          <div className="text-center relative z-10">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              About{" "}
              <span className="text-gradient bg-gradient-to-r from-fuchsia-400 to-blue-500 bg-clip-text text-transparent">
                Nexus of Truth
              </span>
            </motion.h1>
            <motion.p
              className="max-w-3xl mx-auto text-lg text-gray-300 mb-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Combating misinformation and deepfakes with advanced AI technology
              and real-time fact-checking.
            </motion.p>
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <div className="prose prose-lg prose-invert">
                <p className="text-gray-300">
                  At Nexus of Truth, we're dedicated to creating a more truthful
                  digital world. Our mission is to combat the spread of
                  misinformation and deepfakes using cutting-edge AI technology
                  and real-time fact-checking.
                </p>
                <p className="text-gray-300">
                  In an era where information spreads faster than ever,
                  distinguishing fact from fiction has become increasingly
                  challenging. Our platform provides a reliable solution for
                  verifying information across various media formats, from text
                  to video.
                </p>
                <p className="text-gray-300">
                  We believe in the power of truth and transparency. By
                  providing tools that help identify misinformation, we aim to
                  foster a more informed society and restore trust in digital
                  content.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Project Summary Section */}
        <motion.section
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Project Summary
            </motion.h2>
          </div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-xl"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="text-white prose prose-lg prose-invert max-w-none">
              <p>
                Nexus of Truth is an innovative platform designed to combat
                misinformation and deepfakes in real-time. Our system leverages
                advanced AI technologies including natural language processing,
                computer vision, and knowledge graphs to verify information
                across multiple media formats.
              </p>

              <p>The platform consists of several key components:</p>

              <ul>
                <li>
                  <strong>Real-time Fact-checking Engine:</strong> Analyzes
                  claims against a comprehensive knowledge base and trusted
                  sources.
                </li>
                <li>
                  <strong>Deepfake Detection System:</strong> Uses computer
                  vision algorithms to identify manipulated images and videos.
                </li>
                <li>
                  <strong>Knowledge Graph:</strong> A sophisticated database
                  that maps relationships between entities, facts, and sources.
                </li>
                <li>
                  <strong>Broadcast Monitoring:</strong> Real-time analysis of
                  news broadcasts and social media streams.
                </li>
                <li>
                  <strong>User-friendly Interface:</strong> Accessible tools for
                  journalists, researchers, and the general public.
                </li>
              </ul>

              <p>
                Our technology has been developed by a team of researchers and
                engineers from IIIT Bangalore, combining expertise in artificial
                intelligence, data science, and media studies. The platform has
                been trained on diverse datasets to ensure accuracy across
                different domains and cultural contexts.
              </p>

              <p>
                By providing reliable verification tools, we aim to empower
                users to make informed decisions about the content they consume
                and share, ultimately contributing to a healthier information
                ecosystem.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Meet Our Team
            </motion.h2>
            <motion.p
              className="max-w-3xl mx-auto text-lg text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Passionate experts dedicated to fighting misinformation with
              technology
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:border-fuchsia-500/50"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <div className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-2">
                    {member.name}
                  </h3>
                  <p className="text-fuchsia-400 text-center text-sm mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-300 text-center mb-6">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technology Stack Section */}
        <motion.section
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Our Technology Stack
            </motion.h2>
          </div>

          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-xl"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: "TensorFlow", icon: "🧠", category: "AI/ML" },
                { name: "PyTorch", icon: "🔥", category: "AI/ML" },
                { name: "BERT", icon: "📝", category: "NLP" },
                { name: "Neo4j", icon: "🕸️", category: "Database" },
                { name: "React", icon: "⚛️", category: "Frontend" },
                { name: "Python", icon: "🐍", category: "Backend" },
                { name: "Tailwind CSS", icon: "💨", category: "Frontend" },
                { name: "Framer Motion", icon: "🎭", category: "Animation" },
                { name: "Spline", icon: "🎨", category: "3D Graphics" },
                { name: "Gemini", icon: "👾", category: "AI/ML" },
                { name: "Pusher", icon: "📡", category: "Real-time" },
                { name: "Flask", icon: "🧪", category: "Backend" },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/70 rounded-lg p-4 border border-gray-700 hover:border-fuchsia-500/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(165, 76, 114, 0.3)",
                  }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{tech.icon}</div>
                    <h3 className="text-white font-medium mb-1">{tech.name}</h3>
                    <p className="text-xs text-fuchsia-400">{tech.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Frequently Asked Questions
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How accurate is the fact-checking system?",
                answer:
                  "Our fact-checking system achieves over 90% accuracy on benchmark datasets. We continuously improve our models with new data and feedback from experts to maintain high standards of reliability.",
              },
              {
                question: "Can TruthTell detect deepfakes in real-time?",
                answer:
                  "Yes, our system can analyze video streams in real-time to detect potential deepfakes with minimal latency. The detection algorithms are optimized for speed while maintaining high accuracy.",
              },
              {
                question: "What sources does TruthTell use for verification?",
                answer:
                  "TruthTell uses a diverse range of trusted sources including academic publications, government databases, reputable news outlets, and verified expert knowledge. Our knowledge graph connects information across these sources.",
              },
              {
                question: "Is the platform available for public use?",
                answer:
                  "Currently, TruthTell is available in beta for journalists, researchers, and educational institutions. We plan to expand access to the general public in phases to ensure system stability and quality.",
              },
              {
                question: "How does TruthTell handle different languages?",
                answer:
                  "Our platform currently supports fact-checking in English, Hindi, and Spanish, with more languages being added. The multilingual capabilities are built on advanced language models trained on diverse datasets.",
              },
              {
                question: "Can I integrate TruthTell with my own applications?",
                answer:
                  "Yes, we offer API access for developers who want to integrate our fact-checking capabilities into their applications. Contact our team for documentation and partnership opportunities.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <h3 className="text-lg font-bold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    T
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">
                    TruthTell
                  </span>
                </div>
                <p className="text-gray-400 mt-2 max-w-md">
                  Combating misinformation and deepfakes with advanced AI
                  technology and real-time fact-checking.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Research
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} TruthTell. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <FaLinkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <FaGithub className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default About;
