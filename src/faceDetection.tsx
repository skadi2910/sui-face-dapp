import { useEffect } from "react";
import { useFaceDetection } from "./hooks/useFaceDetection";

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
    headMovementDetected,
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

  // Notify parent when verification completes
  useEffect(() => {
    if (livenessResult === "pass") {
      const timer = setTimeout(() => {
        closeWebcam();
        onVerificationComplete(); // Call the parent callback
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [livenessResult, closeWebcam, onVerificationComplete]);

  const handleStartVideo = () => {
    onVerificationReset(); // Reset parent state when starting new verification
    startVideo();
  };

  return (
    <div>
      <div className="text-center p-2.5">
        {/* Step-by-step progress indicator */}
        <div className="mb-5">
          <h3 className="text-gray-800 text-xl font-semibold mb-3">Liveness Verification</h3>
          <div className="text-lg font-bold text-gray-600 mb-2.5">
            {getCurrentStepInstruction()}
          </div>
          
          {/* Progress steps */}
          <div className="flex justify-center gap-5 mb-4">
            <div className={`
              flex items-center px-3 py-2 rounded-full border-2 font-bold
              ${faceDetected 
                ? "bg-green-100 border-green-500" 
                : currentStep === "face" 
                  ? "bg-yellow-100 border-yellow-400" 
                  : "bg-gray-100 border-gray-300"
              }
            `}>
              <span className="mr-2">
                {faceDetected ? "✅" : currentStep === "face" ? "🔄" : "⏳"}
              </span>
              <span>Face Detection</span>
            </div>
            
            <div className={`
              flex items-center px-3 py-2 rounded-full border-2 font-bold
              ${headMovementDetected 
                ? "bg-green-100 border-green-500" 
                : currentStep === "movement" 
                  ? "bg-yellow-100 border-yellow-400" 
                  : "bg-gray-100 border-gray-300"
              }
            `}>
              <span className="mr-2">
                {headMovementDetected ? "✅" : currentStep === "movement" ? "🔄" : "⏳"}
              </span>
              <span>Head Movement</span>
            </div>
            
            <div className={`
              flex items-center px-3 py-2 rounded-full border-2 font-bold
              ${blinkDetected 
                ? "bg-green-100 border-green-500" 
                : currentStep === "blink" 
                  ? "bg-yellow-100 border-yellow-400" 
                  : "bg-gray-100 border-gray-300"
              }
            `}>
              <span className="mr-2">
                {blinkDetected ? "✅" : currentStep === "blink" ? "🔄" : "⏳"}
              </span>
              <span>Blink Detection</span>
            </div>
          </div>
        </div>

        {/* Final result */}
        <div className={`
          text-2xl font-bold mb-5 p-4 rounded-lg border-2
          ${livenessResult === "pass" 
            ? "bg-green-100 text-green-800 border-green-200" 
            : livenessResult === "fail" 
              ? "bg-red-100 text-red-800 border-red-200" 
              : "bg-yellow-100 text-yellow-800 border-yellow-200"
          }
        `}>
          {livenessResult === "pass" ? "🎉 VERIFICATION PASSED!" : 
           livenessResult === "fail" ? "❌ VERIFICATION FAILED" : 
           "⏳ VERIFICATION IN PROGRESS"}
        </div>

        {/* Camera control button */}
        {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg border-0 rounded-lg font-bold transition-colors duration-200"
          >
            Stop Verification
          </button>
        ) : (
          <button
            onClick={handleStartVideo}
            className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg border-0 rounded-lg font-bold transition-colors duration-200"
          >
            Start Verification
          </button>
        )}
      </div>

      {/* Video section */}
      {captureVideo ? (
        modelsLoaded ? (
          <div>
            <div className="flex justify-center p-5 relative">
              <div className="relative w-72 h-80 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-gray-100">
                <video
                  ref={videoRef}
                  height={videoHeight}
                  width={videoWidth}
                  onPlay={handleVideoOnPlay}
                  className="w-full h-full object-cover object-center transform scale-x-[-1]"
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
              </div>
            </div>
            
            {/* Face guide instruction */}
            <div className="text-center mt-2.5 text-sm text-gray-600">
              Position your face within the oval frame
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-lg text-gray-600">
            🔄 Loading AI models...
          </div>
        )
      ) : (
        <div className="text-center py-10 text-base text-gray-400">
          Click "Start Verification" to begin the liveness check
        </div>
      )}
    </div>
  );
};