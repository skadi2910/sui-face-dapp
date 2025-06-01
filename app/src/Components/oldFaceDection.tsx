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
//     headMovementLeftDetected,
//     headMovementRightDetected,
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

//   // Step durations (matching the hook)
//   const STEP_DURATIONS = {
//     face: 2000,      // 2 seconds
//     moveLeft: 3500,  // 3.5 seconds
//     moveRight: 3500, // 3.5 seconds
//     blink: 2500,     // 2.5 seconds
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

//   // Get step-specific instruction for countdown area
//   const getStepInstruction = () => {
//     switch (currentStep) {
//       case "face":
//         return "Position your face in the camera center";
//       case "moveLeft":
//         return "Move your head to the left";
//       case "moveRight":
//         return "Move your head to the right";
//       case "blink":
//         return "Blink your eyes naturally";
//       case "complete":
//         return "Verification complete!";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="text-center">
//         {/* Title and instruction at top */}
//         <div className="mb-8">
//           <h3 className="text-gray-900 text-2xl font-semibold mb-4">Liveness Verification</h3>
//           <div className="text-base font-medium text-gray-700 mb-6 leading-relaxed">
//             {getCurrentStepInstruction()}
//           </div>
//         </div>

//         {/* Final result */}
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
//             {livenessResult === "pass" ? "🎉 Verification Complete!" : 
//              livenessResult === "fail" ? "⚠️ Verification Failed" : 
//              "⏳ Verification in Progress"}
//           </div>
//         </div>

//         {/* Camera control button or proceed button */}
//         <div className="mb-8">
//           {livenessResult === "pass" ? (
//             <div className="space-y-4">
//               <div className="text-lg font-medium text-green-800 mb-4">
//                 ✅ Identity verification successful!
//               </div>
//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={handleProceedToMint}
//                   className="inline-flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base border-0 rounded-lg font-medium transition-colors duration-200"
//                 >
//                   <span className="mr-2">🚀</span>
//                   Proceed to Mint NFT
//                 </button>
//                 <button
//                   onClick={handleVerifyAgain}
//                   className="inline-flex items-center justify-center cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-base border-0 rounded-lg font-medium transition-colors duration-200"
//                 >
//                   <span className="mr-2">🔄</span>
//                   Verify Again
//                 </button>
//               </div>
//             </div>
//           ) : captureVideo && modelsLoaded ? (
//             <button
//               onClick={closeWebcam}
//               className="inline-flex items-center justify-center cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base border-0 rounded-lg font-medium transition-colors duration-200"
//             >
//               <span className="mr-2">⏹️</span>
//               Stop Verification
//             </button>
//           ) : (
//             <button
//               onClick={handleStartVideo}
//               className="inline-flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base border-0 rounded-lg font-medium transition-colors duration-200"
//             >
//               <span className="mr-2">▶️</span>
//               Start Verification
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Video section */}
//       {captureVideo ? (
//         modelsLoaded ? (
//           <div className="space-y-6">
//             <div className="flex justify-center items-center p-6 relative gap-8">
//               {/* Progress steps - positioned to the left - now 4 steps */}
//               <div className="flex flex-col gap-4 w-48">
//                 {/* Step 1: Face Detection */}
//                 <div className={`
//                   flex items-center px-4 py-3 rounded-lg border transition-all duration-300
//                   ${faceDetected 
//                     ? "bg-green-50 border-green-200 text-green-800" 
//                     : currentStep === "face" 
//                       ? "bg-blue-50 border-blue-200 text-blue-800" 
//                       : "bg-white border-gray-200 text-gray-500"
//                   }
//                 `}>
//                   <span className="mr-3 text-base">
//                     {faceDetected ? "✓" : currentStep === "face" ? "●" : "○"}
//                   </span>
//                   <span className="text-sm font-medium">Face Detection</span>
//                   {currentStep === "face" && isTimerActive && (
//                     <span className="ml-2 text-xs text-blue-600">({formatTime(timeRemaining)}s)</span>
//                   )}
//                 </div>
                
//                 {/* Step 2: Move Left */}
//                 <div className={`
//                   flex items-center px-4 py-3 rounded-lg border transition-all duration-300
//                   ${headMovementLeftDetected 
//                     ? "bg-green-50 border-green-200 text-green-800" 
//                     : currentStep === "moveLeft" 
//                       ? "bg-blue-50 border-blue-200 text-blue-800" 
//                       : "bg-white border-gray-200 text-gray-500"
//                   }
//                 `}>
//                   <span className="mr-3 text-base">
//                     {headMovementLeftDetected ? "✓" : currentStep === "moveLeft" ? "●" : "○"}
//                   </span>
//                   <span className="text-sm font-medium">Move Left</span>
//                   {currentStep === "moveLeft" && isTimerActive && (
//                     <span className="ml-2 text-xs text-blue-600">({formatTime(timeRemaining)}s)</span>
//                   )}
//                 </div>
                
//                 {/* Step 3: Move Right */}
//                 <div className={`
//                   flex items-center px-4 py-3 rounded-lg border transition-all duration-300
//                   ${headMovementRightDetected 
//                     ? "bg-green-50 border-green-200 text-green-800" 
//                     : currentStep === "moveRight" 
//                       ? "bg-blue-50 border-blue-200 text-blue-800" 
//                       : "bg-white border-gray-200 text-gray-500"
//                   }
//                 `}>
//                   <span className="mr-3 text-base">
//                     {headMovementRightDetected ? "✓" : currentStep === "moveRight" ? "●" : "○"}
//                   </span>
//                   <span className="text-sm font-medium">Move Right</span>
//                   {currentStep === "moveRight" && isTimerActive && (
//                     <span className="ml-2 text-xs text-blue-600">({formatTime(timeRemaining)}s)</span>
//                   )}
//                 </div>
                
//                 {/* Step 4: Blink Detection */}
//                 <div className={`
//                   flex items-center px-4 py-3 rounded-lg border transition-all duration-300
//                   ${blinkDetected 
//                     ? "bg-green-50 border-green-200 text-green-800" 
//                     : currentStep === "blink" 
//                       ? "bg-blue-50 border-blue-200 text-blue-800" 
//                       : "bg-white border-gray-200 text-gray-500"
//                   }
//                 `}>
//                   <span className="mr-3 text-base">
//                     {blinkDetected ? "✓" : currentStep === "blink" ? "●" : "○"}
//                   </span>
//                   <span className="text-sm font-medium">Blink Detection</span>
//                   {currentStep === "blink" && isTimerActive && (
//                     <span className="ml-2 text-xs text-blue-600">({formatTime(timeRemaining)}s)</span>
//                   )}
//                 </div>
//               </div>

//               {/* Webcam - centered */}
//               <div className="relative w-80 h-96 rounded-lg overflow-hidden border-2 border-blue-600 bg-gray-50 shadow-sm">
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
                
//                 {/* Overlay Timer */}
//                 {isTimerActive && timeRemaining > 0 && currentStep !== "complete" && (
//                   <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
//                     <div className="text-lg font-bold">{formatTime(timeRemaining)}s</div>
//                   </div>
//                 )}
//               </div>

//               {/* Fixed space for countdown - positioned to the right */}
//               <div className="flex flex-col items-center justify-center w-48">
//                 {isTimerActive && timeRemaining > 0 && currentStep !== "complete" ? (
//                   <>
//                     <div className="text-8xl font-bold text-blue-600 mb-4 min-w-[120px] text-center">
//                       {formatTime(timeRemaining)}
//                     </div>
//                     <div className="text-lg font-medium text-gray-600 text-center mb-2">
//                       seconds
//                     </div>
//                     <div className="text-sm text-gray-500 text-center mb-4">
//                       remaining
//                     </div>
//                     {/* Step-specific instruction under countdown */}
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
//                       <div className="text-sm font-medium text-blue-900 text-center leading-relaxed">
//                         {getStepInstruction()}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   // Empty space to maintain layout when countdown is not showing
//                   <div className="h-32"></div>
//                 )}
//               </div>
//             </div>

//             {/* Face guide instruction */}
//             <div className="text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <div className="text-base font-medium text-blue-900 mb-2">
//                 📱 Position your face in the center
//               </div>
//               <div className="text-sm text-blue-700">
//                 Keep your face centered and well-lit for best results
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="text-3xl mb-4">🤖</div>
//             <div className="text-lg font-medium text-gray-900 mb-2">
//               Loading verification system
//             </div>
//             <div className="text-sm text-gray-600">
//               Please wait while we prepare the detection models
//             </div>
//           </div>
//         )
//       ) : (
//         <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
//           <div className="text-3xl mb-4">📸</div>
//           <div className="text-lg font-medium text-gray-900 mb-2">
//             Ready to begin verification
//           </div>
//           <div className="text-sm text-gray-600">
//             Click "Start Verification" to begin the liveness check
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };