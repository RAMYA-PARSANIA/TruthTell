// import React, { useState, memo } from 'react';
// import { FileCheck, Shield, Database, Newspaper, Search, CheckCircle, AlertTriangle, Lock, Unlock, MessageSquare } from 'lucide-react';

// interface DetailedAnalysis {
//   gemini_analysis: {
//     predicted_classification: string;
//     confidence_score: string;
//     reasoning: string[];
//   };
//   text_classification: {
//     category: string;
//     writing_style: string;
//     target_audience: string;
//     content_type: string;
//   };
//   sentiment_analysis: {
//     primary_emotion: string;
//     emotional_intensity: string;
//     sensationalism_level: string;
//     bias_indicators: string[];
//     tone: {
//       formality: string;
//       style: string;
//     };
//     emotional_triggers: string[];
//   };
//   entity_recognition: {
//     source_credibility: string;
//     people: string[];
//     organizations: string[];
//     locations: string[];
//     dates: string[];
//     statistics: string[];
//   };
//   context: {
//     main_narrative: string;
//     supporting_elements: string[];
//     key_claims: string[];
//     narrative_structure: string;
//   };
//   fact_checking: {
//     verifiable_claims: string[];
//     evidence_present: string;
//     fact_check_score: string;
//   };
// }

// const AnimatedBackground = memo(() => {
//   const backgroundIcons = [
//     FileCheck, Shield, Database, Newspaper, Search, CheckCircle, AlertTriangle, Lock, Unlock, MessageSquare
//   ];

//   return (
//     <div className="fixed inset-0 overflow-hidden">
//       <div className="absolute inset-0 transition-colors duration-300 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 animate-gradient-dark" />
      
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `linear-gradient(#ffffff20 1px, transparent 1px), linear-gradient(90deg, #ffffff20 1px, transparent 1px)`,
//           backgroundSize: '50px 50px',
//           animation: 'moveGrid 15s linear infinite'
//         }} />
//       </div>

//       <div className="absolute inset-0">
//         {backgroundIcons.map((Icon, index) => (
//           <div key={index} 
//                className="absolute text-blue-400 opacity-10 animate-float-rotate"
//                style={{
//                  left: `${(index * 20) % 100}%`,
//                  top: `${(index * 25) % 100}%`,
//                  animationDelay: `${index * 2}s`,
//                  animationDuration: `${20 + index * 5}s`,
//                  transform: `scale(${0.8 + (index % 3) * 0.2})`
//                }}>
//             <Icon size={48} />
//           </div>
//         ))}
//       </div>

//       <div className="absolute inset-0">
//         {[...Array(5)].map((_, i) => (
//           <div key={`orb-${i}`}
//                className="absolute rounded-full bg-blue-400 blur-xl opacity-20 animate-pulse-float"
//                style={{
//                  width: `${150 + i * 50}px`,
//                  height: `${150 + i * 50}px`,
//                  left: `${(i * 30) % 100}%`,
//                  top: `${(i * 35) % 100}%`,
//                  animationDelay: `${i * 2}s`,
//                  animationDuration: `${10 + i * 2}s`
//                }} />
//         ))}
//       </div>

//       <div className="absolute inset-0">
//         {[...Array(20)].map((_, i) => (
//           <div key={`particle-${i}`}
//                className="absolute w-1 h-1 rounded-full bg-blue-300 opacity-30 animate-particle"
//                style={{
//                  left: `${Math.random() * 100}%`,
//                  top: `${Math.random() * 100}%`,
//                  animationDelay: `${Math.random() * 5}s`,
//                  animationDuration: `${5 + Math.random() * 10}s`
//                }} />
//         ))}
//       </div>
//     </div>
//   );
// });

// const Dashboard = () => {
//   const [inputText, setInputText] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [result, setResult] = useState<{
//     prediction: string;
//     detailed_analysis: {
//       gemini_analysis: {
//         predicted_classification: string;
//         confidence_score: string;
//         reasoning: string[];
//         text_classification: {
//           category: string;
//           writing_style: string;
//           target_audience: string;
//           content_type: string;
//         };
//         sentiment_analysis: {
//           primary_emotion: string;
//           emotional_intensity: string;
//           sensationalism_level: string;
//           bias_indicators: string[];
//           tone: {
//             formality: string;
//             style: string;
//           };
//           emotional_triggers: string[];
//         };
//         entity_recognition: {
//           source_credibility: string;
//           people: string[];
//           organizations: string[];
//           locations: string[];
//           dates: string[];
//           statistics: string[];
//         };
//         context: {
//           main_narrative: string;
//           supporting_elements: string[];
//           key_claims: string[];
//           narrative_structure: string;
//         };
//         fact_checking: {
//           verifiable_claims: string[];
//           evidence_present: string;
//           fact_check_score: string;
//         };
//       };
//     };
//   } | null>(null);
//   const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

//   const processInput = async () => {
//     if (!inputText.trim()) return;
//     setIsProcessing(true);
//     setResult(null);
//     setShowDetailedAnalysis(false);

//     try {
//       const response = await fetch('http://localhost:8000/analyze', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: inputText }),
//       });
      
//       const data = await response.json();
//       setResult(data);
//     } catch (err) {
//       console.error('Analysis error:', err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <AnimatedBackground />
//       <div className="relative z-10 max-w-3xl mx-auto p-6">
//         <div className="bg-gray-800/80 rounded-lg p-6 backdrop-blur-lg">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold text-white">
//               TruthTell Analysis
//             </h1>
//           </div>
          
//           <div className="space-y-6">
//             <div className="relative">
//               <textarea
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 className="w-full h-40 p-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
//                 placeholder="Enter text to analyze..."
//               />
//               <button
//                 onClick={processInput}
//                 disabled={isProcessing || !inputText.trim()}
//                 className="absolute bottom-4 right-4 px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
//               >
//                 Analyze
//               </button>
//             </div>

//             {isProcessing && (
//               <div className="text-center p-8">
//                 <div className="text-blue-400">Processing...</div>
//               </div>
//             )}

//             {result && (
//               <div className="bg-gray-700/80 rounded-xl p-6">
//                 <div className="text-center mb-4">
//                   <h2 className="text-2xl font-bold text-white capitalize">
//                     {result.prediction}
//                   </h2>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex justify-between text-sm text-blue-300 mb-2">
//                       <span>Confidence</span>
//                       <span>{result.detailed_analysis.gemini_analysis.confidence_score}%</span>
//                     </div>
//                     <div className="h-2 bg-blue-900 rounded">
//                       <div
//                         style={{ width: `${result.detailed_analysis.gemini_analysis.confidence_score}%` }}
//                         className="h-full bg-blue-500 rounded"
//                       />
//                     </div>
//                   </div>
                  
//                   <button
//                     onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
//                     className="w-full mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//                   >
//                     {showDetailedAnalysis ? 'Hide Detailed Analysis' : 'View Detailed Analysis'}
//                   </button>

//                   {showDetailedAnalysis && (
//   <div className="mt-4 p-4 bg-gray-800 rounded-lg">
//     <h3 className="text-xl font-semibold text-white mb-3">Detailed Analysis</h3>
//     <div className="space-y-4 text-gray-300">
//       {result?.detailed_analysis?.text_classification && (
//         <div>
//           <h4 className="font-semibold text-blue-300">Text Classification</h4>
//           <p>Category: {result.detailed_analysis.text_classification.category || 'N/A'}</p>
//           <p>Writing Style: {result.detailed_analysis.text_classification.writing_style || 'N/A'}</p>
//           <p>Target Audience: {result.detailed_analysis.text_classification.target_audience || 'N/A'}</p>
//           <p>Content Type: {result.detailed_analysis.text_classification.content_type || 'N/A'}</p>
//         </div>
//       )}
      
//       {result?.detailed_analysis?.sentiment_analysis && (
//         <div>
//           <h4 className="font-semibold text-blue-300">Sentiment Analysis</h4>
//           <p>Primary Emotion: {result.detailed_analysis.sentiment_analysis.primary_emotion || 'N/A'}</p>
//           <p>Emotional Intensity: {result.detailed_analysis.sentiment_analysis.emotional_intensity || 'N/A'}</p>
//           <p>Sensationalism Level: {result.detailed_analysis.sentiment_analysis.sensationalism_level || 'N/A'}</p>
//           <p>Tone: {result.detailed_analysis.sentiment_analysis.tone?.formality || 'N/A'}, 
//              {result.detailed_analysis.sentiment_analysis.tone?.style || 'N/A'}</p>
//         </div>
//       )}
      
//       {result?.detailed_analysis?.entity_recognition && (
//         <div>
//           <h4 className="font-semibold text-blue-300">Entity Recognition</h4>
//           <p>Source Credibility: {result.detailed_analysis.entity_recognition.source_credibility || 'N/A'}</p>
//           <p>People: {result.detailed_analysis.entity_recognition.people?.join(', ') || 'None'}</p>
//           <p>Organizations: {result.detailed_analysis.entity_recognition.organizations?.join(', ') || 'None'}</p>
//           <p>Locations: {result.detailed_analysis.entity_recognition.locations?.join(', ') || 'None'}</p>
//         </div>
//       )}
      
//       {result?.detailed_analysis?.fact_checking && (
//         <div>
//           <h4 className="font-semibold text-blue-300">Fact Checking</h4>
//           <p>Evidence Present: {result.detailed_analysis.fact_checking.evidence_present || 'N/A'}</p>
//           <p>Fact Check Score: {result.detailed_analysis.fact_checking.fact_check_score || 'N/A'}</p>
//           <p>Verifiable Claims: {result.detailed_analysis.fact_checking.verifiable_claims?.join(', ') || 'None'}</p>
//         </div>
//       )}
//     </div>
//   </div>
// )}


//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Keep the existing style tag */}
//       <style dangerouslySetInnerHTML={{ __html: `
//         @keyframes floatRotate {
//           0% { transform: translate(0, 0) rotate(0deg); }
//           50% { transform: translate(20px, -20px) rotate(180deg); }
//           100% { transform: translate(0, 0) rotate(360deg); }
//         }
//         @keyframes pulseFloat {
//           0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
//           50% { transform: translate(30px, -30px) scale(1.2); opacity: 0.3; }
//           100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
//         }
//         @keyframes moveGrid {
//           0% { transform: translate(0, 0); }
//           100% { transform: translate(50px, 50px); }
//         }
//         @keyframes particle {
//           0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
//           50% { transform: translate(100px, -100px) scale(2); opacity: 0.6; }
//           100% { transform: translate(0, 0) scale(1); opacity: 0

//         }
//         @keyframes gradientAnimation {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         .animate-float-rotate { animation: floatRotate 20s infinite linear; }
//         .animate-pulse-float { animation: pulseFloat 10s infinite ease-in-out; }
//         .animate-particle { animation: particle 8s infinite ease-in-out; }
//         .animate-gradient-dark { background-size: 400% 400%; animation: gradientAnimation 15s ease infinite; }
//       `}} />
//     </div>
//   );
// };

// export default Dashboard;

import { useState, memo } from 'react';
import { FileCheck, Shield, Database, Newspaper, Search, CheckCircle, AlertTriangle, Lock, Unlock, MessageSquare } from 'lucide-react';
import FactCheckStream from '../components/FactCheckStream';

const AnimatedBackground = memo(() => {
  const backgroundIcons = [
    FileCheck, Shield, Database, Newspaper, Search, CheckCircle, AlertTriangle, Lock, Unlock, MessageSquare
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 transition-colors duration-300 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 animate-gradient-dark" />
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#ffffff20 1px, transparent 1px), linear-gradient(90deg, #ffffff20 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'moveGrid 15s linear infinite'
        }} />
      </div>

      <div className="absolute inset-0">
        {backgroundIcons.map((Icon, index) => (
          <div key={index} 
               className="absolute text-blue-400 opacity-10 animate-float-rotate"
               style={{
                 left: `${(index * 20) % 100}%`,
                 top: `${(index * 25) % 100}%`,
                 animationDelay: `${index * 2}s`,
                 animationDuration: `${20 + index * 5}s`,
                 transform: `scale(${0.8 + (index % 3) * 0.2})`
               }}>
            <Icon size={48} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div key={`orb-${i}`}
               className="absolute rounded-full bg-blue-400 blur-xl opacity-20 animate-pulse-float"
               style={{
                 width: `${150 + i * 50}px`,
                 height: `${150 + i * 50}px`,
                 left: `${(i * 30) % 100}%`,
                 top: `${(i * 35) % 100}%`,
                 animationDelay: `${i * 2}s`,
                 animationDuration: `${10 + i * 2}s`
               }} />
        ))}
      </div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div key={`particle-${i}`}
               className="absolute w-1 h-1 rounded-full bg-blue-300 opacity-30 animate-particle"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 5}s`,
                 animationDuration: `${5 + Math.random() * 10}s`
               }} />
        ))}
      </div>
    </div>
  );
});

const Dashboard = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    detailed_analysis: {
      gemini_analysis: {
        predicted_classification: string;
        confidence_score: string;
        reasoning: string[];
      };
      text_classification: {
        category: string;
        writing_style: string;
        target_audience: string;
        content_type: string;
      };
      sentiment_analysis: {
        primary_emotion: string;
        emotional_intensity: string;
        sensationalism_level: string;
        bias_indicators: string[];
        tone: {
          formality: string;
          style: string;
        };
        emotional_triggers: string[];
      };
      fact_checking: {
        verifiable_claims: string[];
        evidence_present: string;
        fact_check_score: string;
      };
    };
  } | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const processInput = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setResult(null);
    setShowDetailedAnalysis(false);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-3xl mx-auto p-6">
        <div className="bg-gray-800/80 rounded-lg p-6 backdrop-blur-lg">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">
              TruthTell Analysis
            </h1>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-40 p-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                placeholder="Enter text to analyze..."
              />
              <button
                onClick={processInput}
                disabled={isProcessing || !inputText.trim()}
                className="absolute bottom-4 right-4 px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
              >
                Analyze
              </button>
            </div>

            {isProcessing && (
              <div className="text-center p-8">
                <div className="text-blue-400">Processing...</div>
              </div>
            )}

            {result && (
              <div className="bg-gray-700/80 rounded-xl p-6">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-white capitalize">
                    {result.detailed_analysis.gemini_analysis.predicted_classification}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-blue-300 mb-2">
                      <span>Confidence</span>
                      <span>{result.detailed_analysis.gemini_analysis.confidence_score}%</span>
                    </div>
                    <div className="h-2 bg-blue-900 rounded">
                      <div
                        style={{ width: `${result.detailed_analysis.gemini_analysis.confidence_score}%` }}
                        className="h-full bg-blue-500 rounded"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                    className="w-full mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    {showDetailedAnalysis ? 'Hide Detailed Analysis' : 'View Detailed Analysis'}
                  </button>

                  {showDetailedAnalysis && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-xl font-semibold text-white mb-3">Detailed Analysis</h3>
                      <div className="space-y-4 text-gray-300">
                        <div>
                          <h4 className="font-semibold text-blue-300">Text Classification</h4>
                          <p>Category: {result.detailed_analysis.text_classification.category || 'N/A'}</p>
                          <p>Writing Style: {result.detailed_analysis.text_classification.writing_style || 'N/A'}</p>
                          <p>Target Audience: {result.detailed_analysis.text_classification.target_audience || 'N/A'}</p>
                          <p>Content Type: {result.detailed_analysis.text_classification.content_type || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-300">Sentiment Analysis</h4>
                          <p>Primary Emotion: {result.detailed_analysis.sentiment_analysis.primary_emotion || 'N/A'}</p>
                          <p>Emotional Intensity: {result.detailed_analysis.sentiment_analysis.emotional_intensity || 'N/A'}</p>
                          <p>Sensationalism Level: {result.detailed_analysis.sentiment_analysis.sensationalism_level || 'N/A'}</p>
                          <p>Tone: {result.detailed_analysis.sentiment_analysis.tone?.formality || 'N/A'}, 
                             {result.detailed_analysis.sentiment_analysis.tone?.style || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-300">Fact Checking</h4>
                          <p>Evidence Present: {result.detailed_analysis.fact_checking.evidence_present || 'N/A'}</p>
                          <p>Fact Check Score: {result.detailed_analysis.fact_checking.fact_check_score || 'N/A'}</p>
                          <p>Verifiable Claims: {result.detailed_analysis.fact_checking.verifiable_claims?.join(', ') || 'None'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <FactCheckStream />
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatRotate {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes pulseFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(30px, -30px) scale(1.2); opacity: 0.3; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes particle {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(100px, -100px) scale(2); opacity: 0.6; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float-rotate { animation: floatRotate 20s infinite linear; }
        .animate-pulse-float { animation: pulseFloat 10s infinite ease-in-out; }
        .animate-particle { animation: particle 8s infinite ease-in-out; }
        .animate-gradient-dark { background-size: 400% 400%; animation: gradientAnimation 15s ease infinite; }
      `}} />
    </div>
  );
};

export default Dashboard;
