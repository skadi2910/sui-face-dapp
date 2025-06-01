// import { useState, useEffect, useRef } from "react";
// import * as faceapi from "face-api.js";

// export const useFaceDetection = () => {
//   // State management
//   const [faceDetected, setFaceDetected] = useState(false);
//   const [captureVideo, setCaptureVideo] = useState(false);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [blinkDetected, setBlinkDetected] = useState(false);
//   const [headMovementDetected, setHeadMovementDetected] = useState(false);
//   const [livenessResult, setLivenessResult] = useState<
//     "pending" | "pass" | "fail"
//   >("pending");

//   // Current step tracking
//   const [currentStep, setCurrentStep] = useState<
//     "face" | "movement" | "blink" | "complete"
//   >("face");

//   // Refs
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const previousPosition = useRef<{ x: number; y: number } | null>(null);
//   const eyeClosedFrames = useRef(0);
//   const intervalRef = useRef<number | null>(null);
//   const movementFrameCounter = useRef(0);
//   const recentPositions = useRef<{ x: number; y: number }[]>([]);

//   // Timing refs for step delays
//   const stepStartTime = useRef<number | null>(null);
//   const faceDetectionStartTime = useRef<number | null>(null);
//   const movementDetectionStartTime = useRef<number | null>(null);
//   const blinkDetectionStartTime = useRef<number | null>(null);
  
//   // Movement tracking
//   const movementDetectedDuringStep = useRef(false);

//   // Constants - Match the actual display size (w-72 h-80 = 288x320px)
//   const videoHeight = 320;
//   const videoWidth = 288;
//   const movementThreshold = 10;
//   const blinkThreshold = 1;
//   const earThreshold = 0.28;

//   // Timing constants (in milliseconds)
//   const FACE_DETECTION_DURATION = 2000; // 2 seconds
//   const MOVEMENT_DETECTION_DURATION = 5000; // 5 seconds
//   const BLINK_DETECTION_DURATION = 2500; // 2.5 seconds

//   // Load models
//   useEffect(() => {
//     const loadModels = async () => {
//       Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//         faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//         faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//         faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//       ]).then(() => {
//         setModelsLoaded(true);
//       });
//     };
//     loadModels();
//   }, []);

//   // Eye Aspect Ratio calculation for blink detection
//   const calculateEAR = (eye: faceapi.Point[]) => {
//     const vertical1 = Math.sqrt(
//       Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2),
//     );
//     const vertical2 = Math.sqrt(
//       Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2),
//     );
//     const horizontal = Math.sqrt(
//       Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2),
//     );
//     return (vertical1 + vertical2) / (2 * horizontal);
//   };

//   const startVideo = () => {
//     // Reset all detection states for fresh start
//     setFaceDetected(false);
//     setBlinkDetected(false);
//     setHeadMovementDetected(false);
//     setLivenessResult("pending");
//     setCurrentStep("face");

//     // Reset refs
//     previousPosition.current = null;
//     eyeClosedFrames.current = 0;
//     movementFrameCounter.current = 0;
//     recentPositions.current = [];
//     movementDetectedDuringStep.current = false;

//     // Reset timing refs
//     stepStartTime.current = null;
//     faceDetectionStartTime.current = null;
//     movementDetectionStartTime.current = null;
//     blinkDetectionStartTime.current = null;

//     setCaptureVideo(true);
//     navigator.mediaDevices
//       .getUserMedia({ video: { width: videoWidth, height: videoHeight } })
//       .then((stream) => {
//         let video = videoRef.current;
//         if (video) {
//           video.srcObject = stream;
//           video.play();
//         }
//       })
//       .catch((err) => {
//         console.error("error:", err);
//       });
//   };

//   const handleVideoOnPlay = () => {
//     // Clear any existing interval
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     intervalRef.current = setInterval(async () => {
//       // Stop processing if verification is complete
//       if (livenessResult === "pass" && currentStep === "complete") {
//         console.log("🎯 Verification complete - stopping detection processing");
//         return;
//       }
      
//       if (canvasRef && canvasRef.current && videoRef.current) {
//         // Check if video is ready
//         if (videoRef.current.readyState !== 4) {
//           return;
//         }

//         const canvas = canvasRef.current;
//         const video = videoRef.current;
        
//         // Make sure canvas matches the display size
//         canvas.width = videoWidth;
//         canvas.height = videoHeight;

//         const ctx = canvas.getContext("2d");
//         if (ctx) {
//           // Clear canvas
//           ctx.clearRect(0, 0, videoWidth, videoHeight);
//         }

//         const displaySize = { width: videoWidth, height: videoHeight };
//         faceapi.matchDimensions(canvas, displaySize);

//         const detections = await faceapi
//           .detectAllFaces(
//             video,
//             new faceapi.TinyFaceDetectorOptions(),
//           )
//           .withFaceLandmarks()
//           .withFaceExpressions();

//         const currentTime = Date.now();

//         if (detections.length > 0) {
//           const landmarks = detections[0].landmarks;
//           const faceCenter = {
//             x: (landmarks.positions[27].x + landmarks.positions[30].x) / 2,
//             y: (landmarks.positions[27].y + landmarks.positions[30].y) / 2,
//           };

//           // Use local variables to track current state within this cycle
//           let localStep = currentStep;
//           let localFaceDetected = faceDetected;
//           let localHeadMovement = headMovementDetected;
//           let localBlink = blinkDetected;

//           // Step 1: Face Detection with timing
//           if (localStep === "face" && !localFaceDetected) {
//             // Start timing when face is first detected
//             if (!faceDetectionStartTime.current) {
//               faceDetectionStartTime.current = currentTime;
//               console.log("👤 Face detected - starting timer");
//             }

//             // Check if enough time has passed
//             const faceDetectionDuration = currentTime - faceDetectionStartTime.current;
//             if (faceDetectionDuration >= FACE_DETECTION_DURATION) {
//               console.log("✅ Step 1: Face detection complete after", faceDetectionDuration, "ms");
//               setFaceDetected(true);
//               localFaceDetected = true;
//               setCurrentStep("movement");
//               localStep = "movement";
//               console.log("Moving to movement step");
//             } else {
//               console.log("Face detected, waiting for timer:", faceDetectionDuration, "/", FACE_DETECTION_DURATION, "ms");
//             }
//           }

//           // Step 2: Head Movement Detection with timing
//           if (
//             localStep === "movement" &&
//             localFaceDetected &&
//             !localHeadMovement
//           ) {
//             // Start the movement timer when entering this step
//             if (!movementDetectionStartTime.current) {
//               movementDetectionStartTime.current = currentTime;
//               movementDetectedDuringStep.current = false;
//               console.log("🔄 Starting movement step timer");
//             }

//             // Store current position in recent positions array
//             recentPositions.current.push(faceCenter);

//             // Keep only last 10 positions (1 second of history)
//             if (recentPositions.current.length > 10) {
//               recentPositions.current.shift();
//             }

//             movementFrameCounter.current++;

//             // Check for movement
//             if (
//               movementFrameCounter.current > 5 &&
//               recentPositions.current.length >= 5
//             ) {
//               // Compare current position with position from 5 frames ago
//               const oldPosition = recentPositions.current[0];
//               const currentPosition = faceCenter;

//               const distance = Math.sqrt(
//                 Math.pow(currentPosition.x - oldPosition.x, 2) +
//                   Math.pow(currentPosition.y - oldPosition.y, 2),
//               );

//               if (distance > movementThreshold) {
//                 movementDetectedDuringStep.current = true;
//                 console.log("🔄 Head movement detected!");
//               }
//             }

//             // Check if enough time has passed
//             const movementDuration = currentTime - movementDetectionStartTime.current;
//             console.log("Movement step timer:", movementDuration, "/", MOVEMENT_DETECTION_DURATION, "ms", 
//                       "Movement detected:", movementDetectedDuringStep.current);

//             if (movementDuration >= MOVEMENT_DETECTION_DURATION) {
//               if (movementDetectedDuringStep.current) {
//                 console.log("✅ Step 2: Head movement complete after", movementDuration, "ms");
//                 setHeadMovementDetected(true);
//                 localHeadMovement = true;
//                 setCurrentStep("blink");
//                 localStep = "blink";
//                 console.log("Moving to blink step");
//               } else {
//                 console.log("⚠️ Time elapsed but no movement detected - restarting movement step");
//                 // Reset movement step
//                 movementDetectionStartTime.current = currentTime;
//                 movementDetectedDuringStep.current = false;
//                 movementFrameCounter.current = 0;
//                 recentPositions.current = [];
//               }
//             }
//           }

//           // Step 3: Blink Detection with timing
//           if (
//             localStep === "blink" &&
//             localFaceDetected &&
//             localHeadMovement &&
//             !localBlink
//           ) {
//             // Start the blink timer when entering this step
//             if (!blinkDetectionStartTime.current) {
//               blinkDetectionStartTime.current = currentTime;
//               console.log("👀 Starting blink step timer");
//             }

//             const leftEye = landmarks.getLeftEye();
//             const rightEye = landmarks.getRightEye();
//             const leftEAR = calculateEAR(leftEye);
//             const rightEAR = calculateEAR(rightEye);
//             const avgEAR = (leftEAR + rightEAR) / 2;

//             if (avgEAR < earThreshold) {
//               eyeClosedFrames.current++;
//             } else {
//               if (eyeClosedFrames.current >= blinkThreshold) {
//                 console.log("👀 Blink detected!");
                
//                 // Check if enough time has passed
//                 const blinkDuration = currentTime - blinkDetectionStartTime.current;
//                 if (blinkDuration >= BLINK_DETECTION_DURATION) {
//                   console.log("✅ Step 3: Blink detection complete after", blinkDuration, "ms");
//                   setBlinkDetected(true);
//                   setCurrentStep("complete");
//                   setLivenessResult("pass");
//                   console.log("🎉 ALL STEPS COMPLETED - LIVENESS CHECK PASSED");
//                   console.log("🛑 Stopping all detection processing...");

//                   // Stop the interval completely after verification is complete
//                   if (intervalRef.current) {
//                     clearInterval(intervalRef.current);
//                     intervalRef.current = null;
//                   }
//                   return; // Exit immediately
//                 } else {
//                   console.log("Blink detected, waiting for timer:", blinkDuration, "/", BLINK_DETECTION_DURATION, "ms");
//                 }
//               }
//               eyeClosedFrames.current = 0;
//             }
//           }

//           // Draw detections with proper scaling and flipping
//           const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
//           if (ctx) {
//             // Clear canvas
//             ctx.clearRect(0, 0, videoWidth, videoHeight);
            
//             // Save context state
//             ctx.save();
            
//             // Apply flip transformation to match video
//             ctx.scale(-1, 1);
//             ctx.translate(-videoWidth, 0);
            
//             // Draw the detections on the flipped context
//             faceapi.draw.drawDetections(canvas, resizedDetections);
//             faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//             faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            
//             // Restore context state
//             ctx.restore();
//           }
//         } else {
//           // Face lost - clear canvas and reset everything
//           if (ctx) {
//             ctx.clearRect(0, 0, videoWidth, videoHeight);
//           }
          
//           if (currentStep !== "face") {
//             console.log("❌ Face lost - restarting from step 1");
//             setFaceDetected(false);
//             setBlinkDetected(false);
//             setHeadMovementDetected(false);
//             setLivenessResult("pending");
//             setCurrentStep("face");
//             previousPosition.current = null;
//             eyeClosedFrames.current = 0;
//             movementFrameCounter.current = 0;
//             recentPositions.current = [];
//             movementDetectedDuringStep.current = false;
            
//             // Reset all timers
//             stepStartTime.current = null;
//             faceDetectionStartTime.current = null;
//             movementDetectionStartTime.current = null;
//             blinkDetectionStartTime.current = null;
//           }
//         }
//       }
//     }, 100);
//   };

//   const closeWebcam = () => {
//     // Clear interval
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }

//     if (videoRef.current) {
//       videoRef.current.pause();
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream?.getTracks()[0].stop();
//     }

//     // Reset all states
//     setFaceDetected(false);
//     setBlinkDetected(false);
//     setHeadMovementDetected(false);
//     setLivenessResult("pending");
//     setCurrentStep("face");

//     // Reset refs
//     previousPosition.current = null;
//     eyeClosedFrames.current = 0;
//     movementFrameCounter.current = 0;
//     recentPositions.current = [];
//     movementDetectedDuringStep.current = false;

//     // Reset timing refs
//     stepStartTime.current = null;
//     faceDetectionStartTime.current = null;
//     movementDetectionStartTime.current = null;
//     blinkDetectionStartTime.current = null;

//     setCaptureVideo(false);
//   };

//   // Helper function to get current step instruction
//   const getCurrentStepInstruction = () => {
//     switch (currentStep) {
//       case "face":
//         return "Please position your face in the camera";
//       case "movement":
//         return "Please move your head slowly";
//       case "blink":
//         return "Please blink your eyes";
//       case "complete":
//         return "Verification complete!";
//       default:
//         return "";
//     }
//   };

//   return {
//     // State
//     faceDetected,
//     captureVideo,
//     modelsLoaded,
//     blinkDetected,
//     headMovementDetected,
//     livenessResult,
//     currentStep,

//     // Refs
//     videoRef,
//     canvasRef,

//     // Constants
//     videoHeight,
//     videoWidth,

//     // Functions
//     startVideo,
//     closeWebcam,
//     handleVideoOnPlay,
//     getCurrentStepInstruction,
//   };
// };

// import { useState, useEffect, useRef } from "react";
// import * as faceapi from "face-api.js";

// export const useFaceDetection = () => {
//   // State management
//   const [faceDetected, setFaceDetected] = useState(false);
//   const [captureVideo, setCaptureVideo] = useState(false);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [blinkDetected, setBlinkDetected] = useState(false);
//   const [headMovementLeftDetected, setHeadMovementLeftDetected] = useState(false);
//   const [headMovementRightDetected, setHeadMovementRightDetected] = useState(false);
//   const [livenessResult, setLivenessResult] = useState<
//     "pending" | "pass" | "fail"
//   >("pending");

//   // Current step tracking
//   const [currentStep, setCurrentStep] = useState<
//     "face" | "moveLeft" | "moveRight" | "blink" | "complete"
//   >("face");

//   // Refs
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const previousPosition = useRef<{ x: number; y: number } | null>(null);
//   const eyeClosedFrames = useRef(0);
//   const intervalRef = useRef<number | null>(null);
//   const movementFrameCounter = useRef(0);
//   const recentPositions = useRef<{ x: number; y: number }[]>([]);

//   // Timing refs for step delays
//   const stepStartTime = useRef<number | null>(null);
//   const faceDetectionStartTime = useRef<number | null>(null);
//   const moveLeftDetectionStartTime = useRef<number | null>(null);
//   const moveRightDetectionStartTime = useRef<number | null>(null);
//   const blinkDetectionStartTime = useRef<number | null>(null);
  
//   // Movement tracking
//   const leftMovementDetectedDuringStep = useRef(false);
//   const rightMovementDetectedDuringStep = useRef(false);
//   const initialFacePosition = useRef<{ x: number; y: number } | null>(null);

//   // Constants - Match the actual display size (w-72 h-80 = 288x320px)
//   const videoHeight = 320;
//   const videoWidth = 288;
//   const movementThreshold = 15; // Increased threshold for directional movement
//   const blinkThreshold = 1;
//   const earThreshold = 0.28;

//   // Timing constants (in milliseconds)
//   const FACE_DETECTION_DURATION = 2000; // 2 seconds
//   const MOVE_LEFT_DETECTION_DURATION = 3500; // 3.5 seconds
//   const MOVE_RIGHT_DETECTION_DURATION = 3500; // 3.5 seconds
//   const BLINK_DETECTION_DURATION = 2500; // 2.5 seconds

//   // Load models
//   useEffect(() => {
//     const loadModels = async () => {
//       Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//         faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//         faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//         faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//       ]).then(() => {
//         setModelsLoaded(true);
//       });
//     };
//     loadModels();
//   }, []);

//   // Eye Aspect Ratio calculation for blink detection
//   const calculateEAR = (eye: faceapi.Point[]) => {
//     const vertical1 = Math.sqrt(
//       Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2),
//     );
//     const vertical2 = Math.sqrt(
//       Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2),
//     );
//     const horizontal = Math.sqrt(
//       Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2),
//     );
//     return (vertical1 + vertical2) / (2 * horizontal);
//   };

//   const startVideo = () => {
//     // Reset all detection states for fresh start
//     setFaceDetected(false);
//     setBlinkDetected(false);
//     setHeadMovementLeftDetected(false);
//     setHeadMovementRightDetected(false);
//     setLivenessResult("pending");
//     setCurrentStep("face");

//     // Reset refs
//     previousPosition.current = null;
//     eyeClosedFrames.current = 0;
//     movementFrameCounter.current = 0;
//     recentPositions.current = [];
//     leftMovementDetectedDuringStep.current = false;
//     rightMovementDetectedDuringStep.current = false;
//     initialFacePosition.current = null;

//     // Reset timing refs
//     stepStartTime.current = null;
//     faceDetectionStartTime.current = null;
//     moveLeftDetectionStartTime.current = null;
//     moveRightDetectionStartTime.current = null;
//     blinkDetectionStartTime.current = null;

//     setCaptureVideo(true);
//     navigator.mediaDevices
//       .getUserMedia({ video: { width: videoWidth, height: videoHeight } })
//       .then((stream) => {
//         let video = videoRef.current;
//         if (video) {
//           video.srcObject = stream;
//           video.play();
//         }
//       })
//       .catch((err) => {
//         console.error("error:", err);
//       });
//   };

//   const handleVideoOnPlay = () => {
//     // Clear any existing interval
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     intervalRef.current = setInterval(async () => {
//       // Stop processing if verification is complete
//       if (livenessResult === "pass" && currentStep === "complete") {
//         console.log("🎯 Verification complete - stopping detection processing");
//         return;
//       }
      
//       if (canvasRef && canvasRef.current && videoRef.current) {
//         // Check if video is ready
//         if (videoRef.current.readyState !== 4) {
//           return;
//         }

//         const canvas = canvasRef.current;
//         const video = videoRef.current;
        
//         // Make sure canvas matches the display size
//         canvas.width = videoWidth;
//         canvas.height = videoHeight;

//         const ctx = canvas.getContext("2d");
//         if (ctx) {
//           // Clear canvas
//           ctx.clearRect(0, 0, videoWidth, videoHeight);
//         }

//         const displaySize = { width: videoWidth, height: videoHeight };
//         faceapi.matchDimensions(canvas, displaySize);

//         const detections = await faceapi
//           .detectAllFaces(
//             video,
//             new faceapi.TinyFaceDetectorOptions(),
//           )
//           .withFaceLandmarks()
//           .withFaceExpressions();

//         const currentTime = Date.now();

//         if (detections.length > 0) {
//           const landmarks = detections[0].landmarks;
//           const faceCenter = {
//             x: (landmarks.positions[27].x + landmarks.positions[30].x) / 2,
//             y: (landmarks.positions[27].y + landmarks.positions[30].y) / 2,
//           };

//           // Use local variables to track current state within this cycle
//           let localStep = currentStep;
//           let localFaceDetected = faceDetected;
//           let localLeftMovement = headMovementLeftDetected;
//           let localRightMovement = headMovementRightDetected;
//           let localBlink = blinkDetected;

//           // Step 1: Face Detection with timing
//           if (localStep === "face" && !localFaceDetected) {
//             // Start timing when face is first detected
//             if (!faceDetectionStartTime.current) {
//               faceDetectionStartTime.current = currentTime;
//               initialFacePosition.current = faceCenter; // Store initial position
//               console.log("👤 Face detected - starting timer");
//             }

//             // Check if enough time has passed
//             const faceDetectionDuration = currentTime - faceDetectionStartTime.current;
//             if (faceDetectionDuration >= FACE_DETECTION_DURATION) {
//               console.log("✅ Step 1: Face detection complete after", faceDetectionDuration, "ms");
//               setFaceDetected(true);
//               localFaceDetected = true;
//               setCurrentStep("moveLeft");
//               localStep = "moveLeft";
//               console.log("Moving to left movement step");
//             } else {
//               console.log("Face detected, waiting for timer:", faceDetectionDuration, "/", FACE_DETECTION_DURATION, "ms");
//             }
//           }

//           // Step 2: Head Movement Left Detection with timing
//           if (
//             localStep === "moveLeft" &&
//             localFaceDetected &&
//             !localLeftMovement
//           ) {
//             // Start the left movement timer when entering this step
//             if (!moveLeftDetectionStartTime.current) {
//               moveLeftDetectionStartTime.current = currentTime;
//               leftMovementDetectedDuringStep.current = false;
//               console.log("⬅️ Starting left movement step timer");
//             }

//             // Check for left movement (face moving to the left side of the screen)
//             if (initialFacePosition.current) {
//               const horizontalDistance = faceCenter.x - initialFacePosition.current.x;
              
//               // Negative distance means moving left (since video is flipped)
//               if (horizontalDistance < -movementThreshold) {
//                 leftMovementDetectedDuringStep.current = true;
//                 console.log("⬅️ Left head movement detected!");
//               }
//             }

//             // Check if enough time has passed
//             const leftMovementDuration = currentTime - moveLeftDetectionStartTime.current;
//             console.log("Left movement step timer:", leftMovementDuration, "/", MOVE_LEFT_DETECTION_DURATION, "ms", 
//                       "Left movement detected:", leftMovementDetectedDuringStep.current);

//             if (leftMovementDuration >= MOVE_LEFT_DETECTION_DURATION) {
//               if (leftMovementDetectedDuringStep.current) {
//                 console.log("✅ Step 2: Left movement complete after", leftMovementDuration, "ms");
//                 setHeadMovementLeftDetected(true);
//                 localLeftMovement = true;
//                 setCurrentStep("moveRight");
//                 localStep = "moveRight";
//                 console.log("Moving to right movement step");
//               } else {
//                 console.log("⚠️ Time elapsed but no left movement detected - restarting left movement step");
//                 // Reset left movement step
//                 moveLeftDetectionStartTime.current = currentTime;
//                 leftMovementDetectedDuringStep.current = false;
//               }
//             }
//           }

//           // Step 3: Head Movement Right Detection with timing
//           if (
//             localStep === "moveRight" &&
//             localFaceDetected &&
//             localLeftMovement &&
//             !localRightMovement
//           ) {
//             // Start the right movement timer when entering this step
//             if (!moveRightDetectionStartTime.current) {
//               moveRightDetectionStartTime.current = currentTime;
//               rightMovementDetectedDuringStep.current = false;
//               console.log("➡️ Starting right movement step timer");
//             }

//             // Check for right movement (face moving to the right side of the screen)
//             if (initialFacePosition.current) {
//               const horizontalDistance = faceCenter.x - initialFacePosition.current.x;
              
//               // Positive distance means moving right (since video is flipped)
//               if (horizontalDistance > movementThreshold) {
//                 rightMovementDetectedDuringStep.current = true;
//                 console.log("➡️ Right head movement detected!");
//               }
//             }

//             // Check if enough time has passed
//             const rightMovementDuration = currentTime - moveRightDetectionStartTime.current;
//             console.log("Right movement step timer:", rightMovementDuration, "/", MOVE_RIGHT_DETECTION_DURATION, "ms", 
//                       "Right movement detected:", rightMovementDetectedDuringStep.current);

//             if (rightMovementDuration >= MOVE_RIGHT_DETECTION_DURATION) {
//               if (rightMovementDetectedDuringStep.current) {
//                 console.log("✅ Step 3: Right movement complete after", rightMovementDuration, "ms");
//                 setHeadMovementRightDetected(true);
//                 localRightMovement = true;
//                 setCurrentStep("blink");
//                 localStep = "blink";
//                 console.log("Moving to blink step");
//               } else {
//                 console.log("⚠️ Time elapsed but no right movement detected - restarting right movement step");
//                 // Reset right movement step
//                 moveRightDetectionStartTime.current = currentTime;
//                 rightMovementDetectedDuringStep.current = false;
//               }
//             }
//           }

//           // Step 4: Blink Detection with timing
//           if (
//             localStep === "blink" &&
//             localFaceDetected &&
//             localLeftMovement &&
//             localRightMovement &&
//             !localBlink
//           ) {
//             // Start the blink timer when entering this step
//             if (!blinkDetectionStartTime.current) {
//               blinkDetectionStartTime.current = currentTime;
//               console.log("👀 Starting blink step timer");
//             }

//             const leftEye = landmarks.getLeftEye();
//             const rightEye = landmarks.getRightEye();
//             const leftEAR = calculateEAR(leftEye);
//             const rightEAR = calculateEAR(rightEye);
//             const avgEAR = (leftEAR + rightEAR) / 2;

//             if (avgEAR < earThreshold) {
//               eyeClosedFrames.current++;
//             } else {
//               if (eyeClosedFrames.current >= blinkThreshold) {
//                 console.log("👀 Blink detected!");
                
//                 // Check if enough time has passed
//                 const blinkDuration = currentTime - blinkDetectionStartTime.current;
//                 if (blinkDuration >= BLINK_DETECTION_DURATION) {
//                   console.log("✅ Step 4: Blink detection complete after", blinkDuration, "ms");
//                   setBlinkDetected(true);
//                   setCurrentStep("complete");
//                   setLivenessResult("pass");
//                   console.log("🎉 ALL STEPS COMPLETED - LIVENESS CHECK PASSED");
//                   console.log("🛑 Stopping all detection processing...");

//                   // Stop the interval completely after verification is complete
//                   if (intervalRef.current) {
//                     clearInterval(intervalRef.current);
//                     intervalRef.current = null;
//                   }
//                   return; // Exit immediately
//                 } else {
//                   console.log("Blink detected, waiting for timer:", blinkDuration, "/", BLINK_DETECTION_DURATION, "ms");
//                 }
//               }
//               eyeClosedFrames.current = 0;
//             }
//           }

//           // Draw detections with proper scaling and flipping
//           const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
//           if (ctx) {
//             // Clear canvas
//             ctx.clearRect(0, 0, videoWidth, videoHeight);
            
//             // Save context state
//             ctx.save();
            
//             // Apply flip transformation to match video
//             ctx.scale(-1, 1);
//             ctx.translate(-videoWidth, 0);
            
//             // Draw the detections on the flipped context
//             faceapi.draw.drawDetections(canvas, resizedDetections);
//             faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//             faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            
//             // Restore context state
//             ctx.restore();
//           }
//         } else {
//           // Face lost - clear canvas and reset everything
//           if (ctx) {
//             ctx.clearRect(0, 0, videoWidth, videoHeight);
//           }
          
//           if (currentStep !== "face") {
//             console.log("❌ Face lost - restarting from step 1");
//             setFaceDetected(false);
//             setBlinkDetected(false);
//             setHeadMovementLeftDetected(false);
//             setHeadMovementRightDetected(false);
//             setLivenessResult("pending");
//             setCurrentStep("face");
//             previousPosition.current = null;
//             eyeClosedFrames.current = 0;
//             movementFrameCounter.current = 0;
//             recentPositions.current = [];
//             leftMovementDetectedDuringStep.current = false;
//             rightMovementDetectedDuringStep.current = false;
//             initialFacePosition.current = null;
            
//             // Reset all timers
//             stepStartTime.current = null;
//             faceDetectionStartTime.current = null;
//             moveLeftDetectionStartTime.current = null;
//             moveRightDetectionStartTime.current = null;
//             blinkDetectionStartTime.current = null;
//           }
//         }
//       }
//     }, 100);
//   };

//   const closeWebcam = () => {
//     // Clear interval
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }

//     if (videoRef.current) {
//       videoRef.current.pause();
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream?.getTracks()[0].stop();
//     }

//     // Reset all states
//     setFaceDetected(false);
//     setBlinkDetected(false);
//     setHeadMovementLeftDetected(false);
//     setHeadMovementRightDetected(false);
//     setLivenessResult("pending");
//     setCurrentStep("face");

//     // Reset refs
//     previousPosition.current = null;
//     eyeClosedFrames.current = 0;
//     movementFrameCounter.current = 0;
//     recentPositions.current = [];
//     leftMovementDetectedDuringStep.current = false;
//     rightMovementDetectedDuringStep.current = false;
//     initialFacePosition.current = null;

//     // Reset timing refs
//     stepStartTime.current = null;
//     faceDetectionStartTime.current = null;
//     moveLeftDetectionStartTime.current = null;
//     moveRightDetectionStartTime.current = null;
//     blinkDetectionStartTime.current = null;

//     setCaptureVideo(false);
//   };

//   // Helper function to get current step instruction
//   const getCurrentStepInstruction = () => {
//     switch (currentStep) {
//       case "face":
//         return "Please position your face in the camera";
//       case "moveLeft":
//         return "Please move your head to the left";
//       case "moveRight":
//         return "Please move your head to the right";
//       case "blink":
//         return "Please blink your eyes";
//       case "complete":
//         return "Verification complete!";
//       default:
//         return "";
//     }
//   };

//   return {
//     // State
//     faceDetected,
//     captureVideo,
//     modelsLoaded,
//     blinkDetected,
//     headMovementLeftDetected,
//     headMovementRightDetected,
//     livenessResult,
//     currentStep,

//     // Refs
//     videoRef,
//     canvasRef,

//     // Constants
//     videoHeight,
//     videoWidth,

//     // Functions
//     startVideo,
//     closeWebcam,
//     handleVideoOnPlay,
//     getCurrentStepInstruction,
//   };
// };