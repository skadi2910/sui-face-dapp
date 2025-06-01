// import { useEffect, useState } from "react";
// import { useFaceDetection } from "../hooks/useFaceDetection";

// interface FaceDetectionProps {
//   onVerificationComplete: () => void;
//   onVerificationReset: () => void;
// }

// export const FaceDetection = ({ onVerificationComplete, onVerificationReset }: FaceDetectionProps) => {
//   const {
//     faceDetected,
//     captureVideo,
//     modelsLoaded,
//     blinkDetected,
//     happyExpressionDetected,
//     angryExpressionDetected,
//     livenessResult,
//     currentStep,
//     videoRef,
//     canvasRef,
//     videoHeight,
//     videoWidth,
//     startVideo,
//     closeWebcam,
//     handleVideoOnPlay,
//     getCurrentStepInstruction,
//   } = useFaceDetection();

//   // Timer state
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [isTimerActive, setIsTimerActive] = useState(false);

//   // Step durations (matching the hook) - Updated timings
//   const STEP_DURATIONS = {
//     face: 2000,    // 2 seconds
//     happy: 2000,   // 2 seconds
//     angry: 2000,   // 2 seconds
//     blink: 2500,   // 2.5 seconds
//   };

//   // Handle timer countdown
//   useEffect(() => {
//     let interval: number;

//     if (isTimerActive && timeRemaining > 0) {
//       interval = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 100) {
//             setIsTimerActive(false);
//             return 0;
//           }
//           return prev - 100;
//         });
//       }, 100);
//     }

//     return () => {
//       if (interval) {
//         clearInterval(interval);
//       }
//     };
//   }, [isTimerActive, timeRemaining]);

//   // Start timer when step changes
//   useEffect(() => {
//     if (captureVideo && modelsLoaded && currentStep !== "complete") {
//       const duration = STEP_DURATIONS[currentStep as keyof typeof STEP_DURATIONS];
//       if (duration) {
//         setTimeRemaining(duration);
//         setIsTimerActive(true);
//       }
//     } else {
//       setIsTimerActive(false);
//       setTimeRemaining(0);
//     }
//   }, [currentStep, captureVideo, modelsLoaded]);

//   // Reset timer when verification stops
//   useEffect(() => {
//     if (!captureVideo) {
//       setIsTimerActive(false);
//       setTimeRemaining(0);
//     }
//   }, [captureVideo]);

//   const handleStartVideo = () => {
//     onVerificationReset(); // Reset parent state when starting new verification
//     startVideo();
//   };

//   const handleProceedToMint = () => {
//     closeWebcam();
//     onVerificationComplete();
//   };

//   const handleVerifyAgain = () => {
//     // Reset internal FaceDetection state
//     closeWebcam(); // This resets all useFaceDetection states
//     // Reset parent state
//     onVerificationReset();
//   };

//   // Format time for display
//   const formatTime = (ms: number) => {
//     const seconds = Math.ceil(ms / 1000);
//     return seconds.toString();
//   };

//   // Get progress percentage
//   const getProgressPercentage = () => {
//     const totalDuration = STEP_DURATIONS[currentStep as keyof typeof STEP_DURATIONS] || 1;
//     return ((totalDuration - timeRemaining) / totalDuration) * 100;
//   };

//   // Get step-specific instruction for countdown area - Made funnier!
//   const getStepInstruction = () => {
//     switch (currentStep) {
//       case "face":
//         return "Look straight at the camera like you're about to become famous! 🌟";
//       case "happy":
//         return "Smile like you just found money in your old jacket! 💰😄";
//       case "angry":
//         return "Make a face like someone just ate your last slice of pizza! 🍕😡";
//       case "blink":
//         return "Blink like you're sending secret morse code! 👁️‍🗨️";
//       case "complete":
//         return "You nailed it! Time to celebrate! 🎊";
//       default:
//         return "";
//     }
//   };

//   // Get fun motivational messages based on step progress
//   const getMotivationalMessage = () => {
//     const progress = getProgressPercentage();
//     if (progress < 25) return "Just getting started! 🚀";
//     if (progress < 50) return "You're doing great! 💪";
//     if (progress < 75) return "Almost there! 🎯";
//     return "So close! Keep going! ⭐";
//   };

//   return (
//     <div className="p-8">
//       <div className="text-center">
//         {/* Title and instruction at top - Made more fun! */}
//         <div className="mb-8">
//           <h3 className="text-gray-900 text-2xl font-semibold mb-4">
//             🎭 The Liveness Challenge! 🎭
//           </h3>
//           <div className="text-base font-medium text-gray-700 mb-6 leading-relaxed">
//             {getCurrentStepInstruction()}
//           </div>
//         </div>

//         {/* Final result - More personality! */}
//         <div className={`
//           text-base font-semibold mb-6 p-4 rounded-lg border transition-all duration-300
//           ${livenessResult === "pass" 
//             ? "bg-green-50 text-green-800 border-green-200" 
//             : livenessResult === "fail" 
//               ? "bg-red-50 text-red-800 border-red-200" 
//               : "bg-blue-50 text-blue-800 border-blue-200"
//           }
//         `}>
//           <div className="mb-1">
//             {livenessResult === "pass" ? "🎉 You're officially awesome! Verification complete!" : 
//              livenessResult === "fail" ? "😅 Oops! Let's try that again, superstar!" : 
//              "🎬 Lights, camera, action! Show us what you've got!"}
//           </div>
//         </div>

//         {/* Camera control button or proceed button - More fun language! */}
//         <div className="mb-8">
//           {livenessResult === "pass" ? (
//             <div className="space-y-4">
//               <div className="text-lg font-medium text-green-800 mb-4">
//                 ✨ You passed with flying colors! Ready to mint your NFT masterpiece?
//               </div>
//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={handleProceedToMint}
//                   className="inline-flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base border-0 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
//                 >
//                   <span className="mr-2">🚀</span>
//                   Let's Mint This Bad Boy!
//                 </button>
//                 <button
//                   onClick={handleVerifyAgain}
//                   className="inline-flex items-center justify-center cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-base border-0 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
//                 >
//                   <span className="mr-2">🎬</span>
//                   I Want Another Take!
//                 </button>
//               </div>
//             </div>
//           ) : captureVideo && modelsLoaded ? (
//             <button
//               onClick={closeWebcam}
//               className="inline-flex items-center justify-center cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base border-0 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
//             >
//               <span className="mr-2">🛑</span>
//               Cut! Stop Recording
//             </button>
//           ) : (
//             <button
//               onClick={handleStartVideo}
//               className="inline-flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base border-0 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
//             >
//               <span className="mr-2">🎬</span>
//               Ready? Let's Roll!
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Video section */}
//       {captureVideo ? (
//         modelsLoaded ? (
//           <div className="space-y-6">
//             <div className="flex justify-center items-center p-6 relative gap-8">
//               {/* Progress steps - positioned to the left - now 4 steps with fun labels */}
//               <div className="flex flex-col gap-4 w-48">
//                 {/* Step 1: Face Detection */}
//                 <div className={`
//                   flex items-center px-4 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105
//                   ${faceDetected 
//                     ? "bg-green-50 border-green-200 text-green-800" 
//                     : currentStep === "face" 
//                       ? "bg-blue-50 border-blue-200 text-blue-800 animate-pulse" 
//                       : "bg-white border-gray-200 text-gray-500"
//                   }
//                 `}>
//                   <span className="mr-3 text-base">
//                     {faceDetected ? "✨" : currentStep === "face" ? "🎯" : "⭕"}
//                   </span>
//                   <span className="text-sm font-medium">📸 Say Cheese!</span>
//                   {currentStep === "face" && isTimerActive && (
//                     <span className="ml-2 text-xs text-blue-600">({formatTime(timeRemaining)}s)</span>
//                   )}
//                 </div>
                
//                 {/* Step 2: Happy Expression */}
//                 <div className={`
//                   flex items-center px-4 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105
//                   ${happyExpressionDetected 
//                     ? "bg-green-50 border-green-200 text-green-800" 
//                     : currentStep === "happy" 
//                       ? "bg-blue-50 border-blue-200 text-blue-800 animate-pulse" 
//                       : "bg-white border-gray-200 text-gray-500"
//                   }
//                 `}>
//                   <span className="mr-3 text-base">
//                     {happyExpressionDetected ? "✨" : currentStep === "happy" ? "😊" : "⭕"}
//                   </span>
//                   <span className="text-sm font-medium">😄 Happiness Mode</span>
//                   {currentStep === "happy" && isTimerActive && (
//                     <span className="ml-2 text-xs text-blue-600">({formatTime(timeRemaining)}s)</span>
//                   )}
//                 </div>
                
//                 {/* Step 3: Angry Expression */}
//                 <div className={`
//                   flex items-center px-4 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105
//                   ${angryExpressionDetected 
//                     ? "bg-green-50 border-green-200 text-green-800" 
//                     : currentStep === "angry" 
//                       ? "bg-blue-50 border-blue-200 text-blue-800 animate-pulse" 
//                       : "bg-white border-gray-200 text-gray-500"
//                   }
//                 `}>
//                   <span className="mr-3 text-base">
//                     {angryExpressionDetected ? "✨" : currentStep === "angry" ? "😠" : "⭕"}
//                   </span>
//                   <span className="text-sm font-medium">😡 Villain Mode</span>
//                   {currentStep === "angry" && isTimerActive && (
//                     <span className="ml-2 text-xs text-blue-600">({formatTime(timeRemaining)}s)</span>
//                   )}
//                 </div>
                
//                 {/* Step 4: Blink Detection */}
//                 <div className={`
//                   flex items-center px-4 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105
//                   ${blinkDetected 
//                     ? "bg-green-50 border-green-200 text-green-800" 
//                     : currentStep === "blink" 
//                       ? "bg-blue-50 border-blue-200 text-blue-800 animate-pulse" 
//                       : "bg-white border-gray-200 text-gray-500"
//                   }
//                 `}>
//                   <span className="mr-3 text-base">
//                     {blinkDetected ? "✨" : currentStep === "blink" ? "👁️" : "⭕"}
//                   </span>
//                   <span className="text-sm font-medium">👀 Blink Magic</span>
//                   {currentStep === "blink" && isTimerActive && (
//                     <span className="ml-2 text-xs text-blue-600">({formatTime(timeRemaining)}s)</span>
//                   )}
//                 </div>
//               </div>

//               {/* Webcam - centered */}
//               <div className="relative w-80 h-96 rounded-lg overflow-hidden border-2 border-blue-600 bg-gray-50 shadow-lg transform hover:scale-105 transition-transform duration-300">
//                 <video
//                   ref={videoRef}
//                   height={videoHeight}
//                   width={videoWidth}
//                   onPlay={handleVideoOnPlay}
//                   className="w-full h-full object-cover object-center transform scale-x-[-1]"
//                 />
//                 <canvas 
//                   ref={canvasRef} 
//                   className="absolute top-0 left-0 w-full h-full pointer-events-none"
//                 />
                
//                 {/* Fun overlay timer */}
//                 {isTimerActive && timeRemaining > 0 && currentStep !== "complete" && (
//                   <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg backdrop-blur-sm border border-blue-400">
//                     <div className="text-lg font-bold">⏰ {formatTime(timeRemaining)}s</div>
//                   </div>
//                 )}

//                 {/* Motivational overlay */}
//                 {isTimerActive && timeRemaining > 0 && currentStep !== "complete" && (
//                   <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white px-3 py-2 rounded-lg backdrop-blur-sm text-center">
//                     <div className="text-sm font-medium">{getMotivationalMessage()}</div>
//                   </div>
//                 )}
//               </div>

//               {/* Fixed space for countdown - positioned to the right with more personality */}
//               <div className="flex flex-col items-center justify-center w-48">
//                 {isTimerActive && timeRemaining > 0 && currentStep !== "complete" ? (
//                   <>
//                     <div className="text-8xl font-bold text-blue-600 mb-4 min-w-[120px] text-center animate-pulse">
//                       {formatTime(timeRemaining)}
//                     </div>
//                     <div className="text-lg font-medium text-gray-600 text-center mb-2">
//                       seconds of glory
//                     </div>
//                     <div className="text-sm text-gray-500 text-center mb-4">
//                       until next challenge
//                     </div>
//                     {/* Step-specific instruction under countdown - Now extra fun! */}
//                     <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mt-2 transform hover:scale-105 transition-transform">
//                       <div className="text-sm font-medium text-blue-900 text-center leading-relaxed">
//                         {getStepInstruction()}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   // Empty space to maintain layout when countdown is not showing
//                   <div className="h-32 flex items-center justify-center">
//                     <div className="text-4xl animate-bounce">🎬</div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Face guide instruction - Made more entertaining! */}
//             <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform">
//               <div className="text-base font-medium text-blue-900 mb-2">
//                 🎪 Welcome to the Facial Expression Circus! 🎪
//               </div>
//               <div className="text-sm text-blue-700">
//                 Keep your magnificent face centered and well-lit for the best show! Think of this as your Hollywood audition! 🌟
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 transform hover:scale-105 transition-transform">
//             <div className="text-3xl mb-4 animate-spin">🤖</div>
//             <div className="text-lg font-medium text-gray-900 mb-2">
//               🧠 Our AI is getting ready to be amazed by you!
//             </div>
//             <div className="text-sm text-gray-600">
//               Warming up the facial recognition engines... Almost ready for your debut! ⚡
//             </div>
//           </div>
//         )
//       ) : (
//         <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 transform hover:scale-105 transition-transform">
//           <div className="text-3xl mb-4 animate-bounce">🎬</div>
//           <div className="text-lg font-medium text-gray-900 mb-2">
//             🌟 Ready for your close-up?
//           </div>
//           <div className="text-sm text-gray-600">
//             Time to become the star of your own verification movie! Lights, camera... action! 🎭
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
import { useEffect, useState } from "react";
import { useFaceDetection } from "../hooks/useFaceDetection";

interface FaceDetectionProps {
  onVerificationComplete: () => void;
  onVerificationReset: () => void;
}

export const FaceDetection = ({ onVerificationComplete, onVerificationReset }: FaceDetectionProps) => {
  const {
    faceDetected,
    captureVideo,
    modelsLoaded,
    blinkDetected,
    happyExpressionDetected,
    angryExpressionDetected,
    livenessResult,
    currentStep,
    videoRef,
    canvasRef,
    videoHeight,
    videoWidth,
    startVideo,
    closeWebcam,
    handleVideoOnPlay,
    getCurrentStepInstruction,
  } = useFaceDetection();

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Step durations (matching the hook) - Updated timings
  const STEP_DURATIONS = {
    face: 2000,    // 2 seconds
    happy: 2000,   // 2 seconds
    angry: 2000,   // 2 seconds
    blink: 2500,   // 2.5 seconds
  };

  // Handle timer countdown
  useEffect(() => {
    let interval: number;

    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 100) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timeRemaining]);

  // Start timer when step changes
  useEffect(() => {
    if (captureVideo && modelsLoaded && currentStep !== "complete") {
      const duration = STEP_DURATIONS[currentStep as keyof typeof STEP_DURATIONS];
      if (duration) {
        setTimeRemaining(duration);
        setIsTimerActive(true);
      }
    } else {
      setIsTimerActive(false);
      setTimeRemaining(0);
    }
  }, [currentStep, captureVideo, modelsLoaded]);

  // Reset timer when verification stops
  useEffect(() => {
    if (!captureVideo) {
      setIsTimerActive(false);
      setTimeRemaining(0);
    }
  }, [captureVideo]);

  const handleStartVideo = () => {
    onVerificationReset(); // Reset parent state when starting new verification
    startVideo();
  };

  const handleProceedToMint = () => {
    closeWebcam();
    onVerificationComplete();
  };

  const handleVerifyAgain = () => {
    // Reset internal FaceDetection state
    closeWebcam(); // This resets all useFaceDetection states
    // Reset parent state
    onVerificationReset();
  };

  // Format time for display
  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return seconds.toString();
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    const totalDuration = STEP_DURATIONS[currentStep as keyof typeof STEP_DURATIONS] || 1;
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  };

  // Get step-specific instruction for countdown area - Made funnier!
  const getStepInstruction = () => {
    switch (currentStep) {
      case "face":
        return "LOOK STRAIGHT AT THE CAMERA LIKE YOU'RE ABOUT TO BECOME FAMOUS! 🌟";
      case "happy":
        return "SMILE LIKE YOU JUST FOUND MONEY IN YOUR OLD JACKET! 💰😄";
      case "angry":
        return "MAKE A FACE LIKE SOMEONE ATE YOUR LAST SLICE OF PIZZA! 🍕😡";
      case "blink":
        return "BLINK LIKE YOU'RE SENDING SECRET MORSE CODE! 👁️‍🗨️";
      case "complete":
        return "YOU NAILED IT! TIME TO CELEBRATE! 🎊";
      default:
        return "";
    }
  };

  // Get fun motivational messages based on step progress
  const getMotivationalMessage = () => {
    const progress = getProgressPercentage();
    if (progress < 25) return "JUST GETTING STARTED! 🚀";
    if (progress < 50) return "YOU'RE DOING GREAT! 💪";
    if (progress < 75) return "ALMOST THERE! 🎯";
    return "SO CLOSE! KEEP GOING! ⭐";
  };

  return (
    <div className="p-8">
      <div className="text-center">
        {/* Title and instruction at top - Retro Style! */}
        <div className="mb-8">
          <h3 className="retro-title text-4xl text-neon-green text-3d-effect mb-6 animate-retro-pulse">
            🎭 THE LIVENESS CHALLENGE! 🎭
          </h3>
          <div className="retro-text text-xl text-neon-cyan mb-6 leading-relaxed retro-text-glow">
            {getCurrentStepInstruction()}
          </div>
        </div>

        {/* Final result - Retro Alert Style! */}
        <div className={`mb-6 ${
          livenessResult === "pass" 
            ? "retro-alert retro-alert-success" 
            : livenessResult === "fail" 
              ? "retro-alert retro-alert-error" 
              : "retro-alert retro-alert-info"
        }`}>
          <div className="retro-text text-xl">
            {livenessResult === "pass" ? "🎉 YOU'RE OFFICIALLY AWESOME! VERIFICATION COMPLETE!" : 
             livenessResult === "fail" ? "😅 OOPS! LET'S TRY THAT AGAIN, SUPERSTAR!" : 
             "🎬 LIGHTS, CAMERA, ACTION! SHOW US WHAT YOU'VE GOT!"}
          </div>
        </div>

        {/* Camera control button or proceed button - Retro Buttons! */}
        <div className="mb-8">
          {livenessResult === "pass" ? (
            <div className="space-y-6">
              <div className="retro-text text-2xl text-neon-green mb-6 retro-text-glow">
                ✨ YOU PASSED WITH FLYING COLORS! READY TO MINT YOUR NFT MASTERPIECE?
              </div>
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={handleProceedToMint}
                  className="retro-btn retro-btn-success retro-btn-xl"
                >
                  <span className="mr-3">🚀</span>
                  LET'S MINT THIS BAD BOY!
                </button>
                <button
                  onClick={handleVerifyAgain}
                  className="retro-btn retro-btn-secondary"
                >
                  <span className="mr-3">🎬</span>
                  I WANT ANOTHER TAKE!
                </button>
              </div>
            </div>
          ) : captureVideo && modelsLoaded ? (
            <button
              onClick={closeWebcam}
              className="retro-btn retro-btn-danger"
            >
              <span className="mr-3">🛑</span>
              CUT! STOP RECORDING
            </button>
          ) : (
            <button
              onClick={handleStartVideo}
              className="retro-btn retro-btn-primary retro-btn-xl"
            >
              <span className="mr-3">🎬</span>
              READY? LET'S ROLL!
            </button>
          )}
        </div>
      </div>

      {/* Video section */}
      {captureVideo ? (
        modelsLoaded ? (
          <div className="space-y-8">
            <div className="flex justify-center items-center p-6 relative gap-8 flex-wrap">
              {/* Progress steps - positioned to the left - Retro Cards */}
              <div className="flex flex-col gap-4 w-64">
                {/* Step 1: Face Detection */}
                <div className={`retro-card-inner p-4 rounded-lg border-4 transition-all duration-300 retro-hover-float ${
                  faceDetected 
                    ? "retro-glow-green" 
                    : currentStep === "face" 
                      ? "retro-glow-cyan animate-retro-pulse" 
                      : "retro-border"
                }`} style={{
                  background: faceDetected 
                    ? 'linear-gradient(135deg, #00ff00 0%, #00ffff 100%)' 
                    : currentStep === "face" 
                      ? 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
                      : 'rgba(0, 0, 0, 0.7)',
                  borderColor: faceDetected ? '#ffff00' : currentStep === "face" ? '#00ffff' : '#666'
                }}>
                  <div className="flex items-center">
                    <span className="mr-3 text-2xl">
                      {faceDetected ? "✨" : currentStep === "face" ? "🎯" : "⭕"}
                    </span>
                    <span className={`retro-text text-lg ${
                      faceDetected ? 'text-black' : 'text-neon-cyan'
                    }`}>
                      📸 SAY CHEESE!
                    </span>
                    {currentStep === "face" && isTimerActive && (
                      <span className="ml-2 retro-mono text-sm text-neon-yellow">
                        ({formatTime(timeRemaining)}s)
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Step 2: Happy Expression */}
                <div className={`retro-card-inner p-4 rounded-lg border-4 transition-all duration-300 retro-hover-float ${
                  happyExpressionDetected 
                    ? "retro-glow-green" 
                    : currentStep === "happy" 
                      ? "retro-glow-cyan animate-retro-pulse" 
                      : "retro-border"
                }`} style={{
                  background: happyExpressionDetected 
                    ? 'linear-gradient(135deg, #00ff00 0%, #00ffff 100%)' 
                    : currentStep === "happy" 
                      ? 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
                      : 'rgba(0, 0, 0, 0.7)',
                  borderColor: happyExpressionDetected ? '#ffff00' : currentStep === "happy" ? '#00ffff' : '#666'
                }}>
                  <div className="flex items-center">
                    <span className="mr-3 text-2xl">
                      {happyExpressionDetected ? "✨" : currentStep === "happy" ? "😊" : "⭕"}
                    </span>
                    <span className={`retro-text text-lg ${
                      happyExpressionDetected ? 'text-black' : 'text-neon-cyan'
                    }`}>
                      😄 HAPPINESS MODE
                    </span>
                    {currentStep === "happy" && isTimerActive && (
                      <span className="ml-2 retro-mono text-sm text-neon-yellow">
                        ({formatTime(timeRemaining)}s)
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Step 3: Angry Expression */}
                <div className={`retro-card-inner p-4 rounded-lg border-4 transition-all duration-300 retro-hover-float ${
                  angryExpressionDetected 
                    ? "retro-glow-green" 
                    : currentStep === "angry" 
                      ? "retro-glow-cyan animate-retro-pulse" 
                      : "retro-border"
                }`} style={{
                  background: angryExpressionDetected 
                    ? 'linear-gradient(135deg, #00ff00 0%, #00ffff 100%)' 
                    : currentStep === "angry" 
                      ? 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
                      : 'rgba(0, 0, 0, 0.7)',
                  borderColor: angryExpressionDetected ? '#ffff00' : currentStep === "angry" ? '#00ffff' : '#666'
                }}>
                  <div className="flex items-center">
                    <span className="mr-3 text-2xl">
                      {angryExpressionDetected ? "✨" : currentStep === "angry" ? "😠" : "⭕"}
                    </span>
                    <span className={`retro-text text-lg ${
                      angryExpressionDetected ? 'text-black' : 'text-neon-cyan'
                    }`}>
                      😡 VILLAIN MODE
                    </span>
                    {currentStep === "angry" && isTimerActive && (
                      <span className="ml-2 retro-mono text-sm text-neon-yellow">
                        ({formatTime(timeRemaining)}s)
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Step 4: Blink Detection */}
                <div className={`retro-card-inner p-4 rounded-lg border-4 transition-all duration-300 retro-hover-float ${
                  blinkDetected 
                    ? "retro-glow-green" 
                    : currentStep === "blink" 
                      ? "retro-glow-cyan animate-retro-pulse" 
                      : "retro-border"
                }`} style={{
                  background: blinkDetected 
                    ? 'linear-gradient(135deg, #00ff00 0%, #00ffff 100%)' 
                    : currentStep === "blink" 
                      ? 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
                      : 'rgba(0, 0, 0, 0.7)',
                  borderColor: blinkDetected ? '#ffff00' : currentStep === "blink" ? '#00ffff' : '#666'
                }}>
                  <div className="flex items-center">
                    <span className="mr-3 text-2xl">
                      {blinkDetected ? "✨" : currentStep === "blink" ? "👁️" : "⭕"}
                    </span>
                    <span className={`retro-text text-lg ${
                      blinkDetected ? 'text-black' : 'text-neon-cyan'
                    }`}>
                      👀 BLINK MAGIC
                    </span>
                    {currentStep === "blink" && isTimerActive && (
                      <span className="ml-2 retro-mono text-sm text-neon-yellow">
                        ({formatTime(timeRemaining)}s)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Webcam - centered with retro styling */}
              <div className="retro-card retro-hover-float relative w-80 h-96 overflow-hidden">
                <div className="retro-card-inner h-full relative">
                  <video
                    ref={videoRef}
                    height={videoHeight}
                    width={videoWidth}
                    onPlay={handleVideoOnPlay}
                    className="w-full h-full object-cover object-center transform scale-x-[-1] rounded"
                  />
                  <canvas 
                    ref={canvasRef} 
                    className="absolute top-0 left-0 w-full h-full pointer-events-none rounded"
                  />
                  
                  {/* Retro timer overlay */}
                  {isTimerActive && timeRemaining > 0 && currentStep !== "complete" && (
                    <div 
                      className="absolute top-4 left-4 p-3 rounded-lg border-2"
                      style={{
                        background: 'rgba(0, 0, 0, 0.9)',
                        border: '2px solid #00ffff',
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.7)'
                      }}
                    >
                      <div className="retro-title text-2xl text-neon-cyan">
                        ⏰ {formatTime(timeRemaining)}s
                      </div>
                    </div>
                  )}

                  {/* Motivational overlay - Retro Style */}
                  {isTimerActive && timeRemaining > 0 && currentStep !== "complete" && (
                    <div 
                      className="absolute bottom-4 left-4 right-4 p-3 rounded-lg border-2 text-center"
                      style={{
                        background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
                        border: '2px solid #ffff00',
                        boxShadow: '0 0 20px rgba(255, 0, 255, 0.7)'
                      }}
                    >
                      <div className="retro-text text-lg text-white">
                        {getMotivationalMessage()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Countdown section - Retro styling */}
              <div className="flex flex-col items-center justify-center w-64">
                {isTimerActive && timeRemaining > 0 && currentStep !== "complete" ? (
                  <>
                    <div 
                      className="retro-title text-8xl mb-4 text-center animate-retro-pulse"
                      style={{
                        color: '#00ffff',
                        textShadow: '0 0 30px #00ffff, 4px 4px 0px #ff00ff, 8px 8px 0px #ffff00'
                      }}
                    >
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="retro-text text-xl text-neon-yellow text-center mb-2">
                      SECONDS OF GLORY
                    </div>
                    <div className="retro-text text-lg text-neon-green text-center mb-4">
                      UNTIL NEXT CHALLENGE
                    </div>
                    {/* Step-specific instruction under countdown - Retro Card */}
                    <div className="retro-card-inner p-4 rounded-lg border-2 retro-hover-float mt-4" style={{
                      background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
                      borderColor: '#00ffff',
                      boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
                    }}>
                      <div className="retro-text text-sm text-neon-cyan text-center leading-relaxed">
                        {getStepInstruction()}
                      </div>
                    </div>
                  </>
                ) : (
                  // Empty space to maintain layout when countdown is not showing
                  <div className="h-32 flex items-center justify-center">
                    <div className="text-6xl animate-bounce">🎬</div>
                  </div>
                )}
              </div>
            </div>

            {/* Face guide instruction - Retro Alert */}
            <div className="retro-alert retro-alert-info text-center">
              <div className="retro-title text-2xl text-neon-cyan mb-2">
                🎪 WELCOME TO THE FACIAL EXPRESSION CIRCUS! 🎪
              </div>
              <div className="retro-text text-lg text-neon-yellow">
                KEEP YOUR MAGNIFICENT FACE CENTERED AND WELL-LIT FOR THE BEST SHOW! 
                THINK OF THIS AS YOUR HOLLYWOOD AUDITION! 🌟
              </div>
            </div>
          </div>
        ) : (
          <div className="retro-card retro-hover-float">
            <div className="retro-card-inner p-12 text-center">
              <div className="text-6xl mb-6 animate-spin">🤖</div>
              <div className="retro-title text-2xl text-neon-green mb-4">
                🧠 OUR AI IS GETTING READY TO BE AMAZED BY YOU!
              </div>
              <div className="retro-text text-lg text-neon-yellow">
                WARMING UP THE FACIAL RECOGNITION ENGINES... ALMOST READY FOR YOUR DEBUT! ⚡
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="retro-card retro-hover-float">
          <div className="retro-card-inner p-12 text-center">
            <div className="text-6xl mb-6 animate-bounce">🎬</div>
            <div className="retro-title text-2xl text-neon-green mb-4">
              🌟 READY FOR YOUR CLOSE-UP?
            </div>
            <div className="retro-text text-lg text-neon-yellow">
              TIME TO BECOME THE STAR OF YOUR OWN VERIFICATION MOVIE! 
              LIGHTS, CAMERA... ACTION! 🎭
            </div>
          </div>
        </div>
      )}
    </div>
  );
};