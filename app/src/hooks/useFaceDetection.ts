import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export const useFaceDetection = () => {
  // State management
  const [faceDetected, setFaceDetected] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [happyExpressionDetected, setHappyExpressionDetected] = useState(false);
  const [angryExpressionDetected, setAngryExpressionDetected] = useState(false);
  const [livenessResult, setLivenessResult] = useState<
    "pending" | "pass" | "fail"
  >("pending");

  // Current step tracking
  const [currentStep, setCurrentStep] = useState<
    "face" | "happy" | "angry" | "blink" | "complete"
  >("face");

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eyeClosedFrames = useRef(0);
  const intervalRef = useRef<number | null>(null);

  // Use refs for immediate state tracking to avoid async state issues
  const currentStepRef = useRef<"face" | "happy" | "angry" | "blink" | "complete">("face");
  const faceDetectedRef = useRef(false);
  const happyDetectedRef = useRef(false);
  const angryDetectedRef = useRef(false);

  // Face loss tracking to prevent random jumps back
  const faceLostFrameCount = useRef(0);
  const FACE_LOST_THRESHOLD = 10; // Allow 10 frames (1 second) of face loss before resetting

  // Timing refs for step delays
  const faceDetectionStartTime = useRef<number | null>(null);
  const happyDetectionStartTime = useRef<number | null>(null);
  const angryDetectionStartTime = useRef<number | null>(null);
  const blinkDetectionStartTime = useRef<number | null>(null);
  
  // Expression tracking
  const happyDetectedDuringStep = useRef(false);
  const angryDetectedDuringStep = useRef(false);

  // Constants - Match the actual display size (w-72 h-80 = 288x320px)
  const videoHeight = 320;
  const videoWidth = 288;
  const blinkThreshold = 1;
  const earThreshold = 0.28;
  const expressionThreshold = 0.25; // 25% threshold

  // Timing constants (in milliseconds) - Updated to make expressions faster
  const FACE_DETECTION_DURATION = 2000; // 2 seconds
  const HAPPY_DETECTION_DURATION = 2000; // 2 seconds (reduced from 3.5)
  const ANGRY_DETECTION_DURATION = 2000; // 2 seconds (reduced from 3.5)
  const BLINK_DETECTION_DURATION = 2500; // 2.5 seconds

  // Helper function to update both state and ref
  const updateCurrentStep = (newStep: "face" | "happy" | "angry" | "blink" | "complete") => {
    console.log("🔄 Updating step from", currentStepRef.current, "to", newStep);
    currentStepRef.current = newStep;
    setCurrentStep(newStep);
  };

  const updateFaceDetected = (detected: boolean) => {
    faceDetectedRef.current = detected;
    setFaceDetected(detected);
  };

  const updateHappyDetected = (detected: boolean) => {
    happyDetectedRef.current = detected;
    setHappyExpressionDetected(detected);
  };

  const updateAngryDetected = (detected: boolean) => {
    angryDetectedRef.current = detected;
    setAngryExpressionDetected(detected);
  };

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]).then(() => {
        setModelsLoaded(true);
      });
    };
    loadModels();
  }, []);

  // Eye Aspect Ratio calculation for blink detection
  const calculateEAR = (eye: faceapi.Point[]) => {
    const vertical1 = Math.sqrt(
      Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2),
    );
    const vertical2 = Math.sqrt(
      Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2),
    );
    const horizontal = Math.sqrt(
      Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2),
    );
    return (vertical1 + vertical2) / (2 * horizontal);
  };

  // Helper function to check if happy expressions are detected
  const isHappyExpression = (expressions: any) => {
    try {
      const happyScore = expressions.happy || 0;
      const surprisedScore = expressions.surprised || 0;
      
      // More lenient detection - any smile-related expression
      const isHappy = happyScore > expressionThreshold || surprisedScore > expressionThreshold;
      
      // console.log("😊 Happy check - Happy:", (happyScore * 100).toFixed(1) + "%", 
      //             "Surprised:", (surprisedScore * 100).toFixed(1) + "%", 
      //             "Result:", isHappy);
      
      return isHappy;
    } catch (error) {
      console.error("Error in isHappyExpression:", error);
      return false;
    }
  };

  // Helper function to check if angry expressions are detected
  const isAngryExpression = (expressions: any) => {
    try {
      const angryScore = expressions.angry || 0;
      const disgustedScore = expressions.disgusted || 0;
      const sadScore = expressions.sad || 0;
      const fearfulScore = expressions.fearful || 0;
      
      // Consider any negative emotion
      const isAngry = angryScore > expressionThreshold || 
                     disgustedScore > expressionThreshold || 
                     sadScore > expressionThreshold ||
                     fearfulScore > expressionThreshold;
      
      // console.log("😠 Angry check - Angry:", (angryScore * 100).toFixed(1) + "%", 
      //             "Disgusted:", (disgustedScore * 100).toFixed(1) + "%", 
      //             "Sad:", (sadScore * 100).toFixed(1) + "%",
      //             "Fearful:", (fearfulScore * 100).toFixed(1) + "%",
      //             "Result:", isAngry);
      
      return isAngry;
    } catch (error) {
      console.error("Error in isAngryExpression:", error);
      return false;
    }
  };

  const startVideo = () => {
    // Reset all detection states for fresh start
    updateFaceDetected(false);
    setBlinkDetected(false);
    updateHappyDetected(false);
    updateAngryDetected(false);
    setLivenessResult("pending");
    updateCurrentStep("face");

    // Reset refs
    eyeClosedFrames.current = 0;
    happyDetectedDuringStep.current = false;
    angryDetectedDuringStep.current = false;
    faceLostFrameCount.current = 0;

    // Reset timing refs
    faceDetectionStartTime.current = null;
    happyDetectionStartTime.current = null;
    angryDetectionStartTime.current = null;
    blinkDetectionStartTime.current = null;

    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: videoWidth, height: videoHeight } })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const handleVideoOnPlay = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      // Stop processing if verification is complete
      if (livenessResult === "pass" && currentStepRef.current === "complete") {
        // console.log("🎯 Verification complete - stopping detection processing");
        return;
      }
      
      if (canvasRef && canvasRef.current && videoRef.current) {
        // Check if video is ready
        if (videoRef.current.readyState !== 4) {
          return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        // Make sure canvas matches the display size
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Clear canvas
          ctx.clearRect(0, 0, videoWidth, videoHeight);
        }

        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions(),
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        const currentTime = Date.now();

        if (detections.length > 0) {
          // Face is detected - reset face lost counter
          faceLostFrameCount.current = 0;
          
          const landmarks = detections[0].landmarks;
          const expressions = detections[0].expressions;

          // Step 1: Face Detection with timing
          if (currentStepRef.current === "face" && !faceDetectedRef.current) {
            // Start timing when face is first detected
            if (!faceDetectionStartTime.current) {
              faceDetectionStartTime.current = currentTime;
              // console.log("👤 Face detected - starting timer");
            }

            // Check if enough time has passed
            const faceDetectionDuration = currentTime - faceDetectionStartTime.current;
            if (faceDetectionDuration >= FACE_DETECTION_DURATION) {
              console.log("✅ Step 1: Face detection complete after", faceDetectionDuration, "ms");
              updateFaceDetected(true);
              updateCurrentStep("happy");
              // console.log("🎯 Successfully moved to happy expression step");
            } else {
              // console.log("Face detected, waiting for timer:", faceDetectionDuration, "/", FACE_DETECTION_DURATION, "ms");
            }
          }

          // Step 2: Happy Expression Detection with timing (now 2 seconds)
          else if (currentStepRef.current === "happy" && faceDetectedRef.current && !happyDetectedRef.current) {
            // Start the happy expression timer when entering this step
            if (!happyDetectionStartTime.current) {
              happyDetectionStartTime.current = currentTime;
              happyDetectedDuringStep.current = false;
              // console.log("😊 Starting happy expression step timer (2 seconds)");
            }

            // Check for happy expression using improved detection
            if (expressions && isHappyExpression(expressions)) {
              happyDetectedDuringStep.current = true;
              // console.log("😊 Happy expression detected and marked!");
            }

            // Check if enough time has passed
            const happyDuration = currentTime - happyDetectionStartTime.current;
            console.log("😊 Happy timer:", happyDuration, "/", HAPPY_DETECTION_DURATION, "ms", 
                      "| Detected:", happyDetectedDuringStep.current);

            if (happyDuration >= HAPPY_DETECTION_DURATION) {
              if (happyDetectedDuringStep.current) {
                console.log("✅ Step 2: Happy expression complete after", happyDuration, "ms");
                updateHappyDetected(true);
                updateCurrentStep("angry");
                console.log("🎯 Successfully moved to angry expression step");
              } else {
                console.log("⚠️ Time elapsed but no happy expression detected - restarting happy step");
                // Reset happy expression step
                happyDetectionStartTime.current = null;
                happyDetectedDuringStep.current = false;
              }
            }
          }

          // Step 3: Angry Expression Detection with timing (now 2 seconds)
          else if (currentStepRef.current === "angry" && faceDetectedRef.current && happyDetectedRef.current && !angryDetectedRef.current) {
            // Start the angry expression timer when entering this step
            if (!angryDetectionStartTime.current) {
              angryDetectionStartTime.current = currentTime;
              angryDetectedDuringStep.current = false;
              console.log("😠 Starting angry expression step timer (2 seconds)");
            }

            // Check for angry expression using improved detection
            if (expressions && isAngryExpression(expressions)) {
              angryDetectedDuringStep.current = true;
              console.log("😠 Angry expression detected and marked!");
            }

            // Check if enough time has passed
            const angryDuration = currentTime - angryDetectionStartTime.current;
            console.log("😠 Angry timer:", angryDuration, "/", ANGRY_DETECTION_DURATION, "ms", 
                      "| Detected:", angryDetectedDuringStep.current);

            if (angryDuration >= ANGRY_DETECTION_DURATION) {
              if (angryDetectedDuringStep.current) {
                console.log("✅ Step 3: Angry expression complete after", angryDuration, "ms");
                updateAngryDetected(true);
                updateCurrentStep("blink");
                console.log("🎯 Successfully moved to blink step");
              } else {
                console.log("⚠️ Time elapsed but no angry expression detected - restarting angry step");
                // Reset angry expression step
                angryDetectionStartTime.current = null;
                angryDetectedDuringStep.current = false;
              }
            }
          }

          // Step 4: Blink Detection with timing
          else if (currentStepRef.current === "blink" && faceDetectedRef.current && happyDetectedRef.current && angryDetectedRef.current && !blinkDetected) {
            // Start the blink timer when entering this step
            if (!blinkDetectionStartTime.current) {
              blinkDetectionStartTime.current = currentTime;
              console.log("👀 Starting blink step timer");
            }

            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            const leftEAR = calculateEAR(leftEye);
            const rightEAR = calculateEAR(rightEye);
            const avgEAR = (leftEAR + rightEAR) / 2;

            if (avgEAR < earThreshold) {
              eyeClosedFrames.current++;
            } else {
              if (eyeClosedFrames.current >= blinkThreshold) {
                console.log("👀 Blink detected!");
                
                // Check if enough time has passed
                const blinkDuration = currentTime - blinkDetectionStartTime.current;
                if (blinkDuration >= BLINK_DETECTION_DURATION) {
                  console.log("✅ Step 4: Blink detection complete after", blinkDuration, "ms");
                  setBlinkDetected(true);
                  updateCurrentStep("complete");
                  setLivenessResult("pass");
                  console.log("🎉 ALL STEPS COMPLETED - LIVENESS CHECK PASSED");

                  // Stop the interval completely after verification is complete
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                  return; // Exit immediately
                } else {
                  console.log("Blink detected, waiting for timer:", blinkDuration, "/", BLINK_DETECTION_DURATION, "ms");
                }
              }
              eyeClosedFrames.current = 0;
            }
          }

          // Draw detections with proper scaling and flipping
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          if (ctx) {
            // Clear canvas
            ctx.clearRect(0, 0, videoWidth, videoHeight);
            
            // Save context state
            ctx.save();
            
            // Apply flip transformation to match video
            ctx.scale(-1, 1);
            ctx.translate(-videoWidth, 0);
            
            // Draw the detections on the flipped context
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            
            // Restore context state
            ctx.restore();
          }
        } else {
          // Face lost - but don't reset immediately to prevent random jumps
          faceLostFrameCount.current++;
          
          if (ctx) {
            ctx.clearRect(0, 0, videoWidth, videoHeight);
          }
          
          // Only reset if face has been lost for more than the threshold AND we're not in the first step
          if (faceLostFrameCount.current >= FACE_LOST_THRESHOLD && currentStepRef.current !== "face") {
            // console.log("❌ Face lost for", faceLostFrameCount.current, "frames - restarting from step 1");
            updateFaceDetected(false);
            setBlinkDetected(false);
            updateHappyDetected(false);
            updateAngryDetected(false);
            setLivenessResult("pending");
            updateCurrentStep("face");
            eyeClosedFrames.current = 0;
            happyDetectedDuringStep.current = false;
            angryDetectedDuringStep.current = false;
            faceLostFrameCount.current = 0;
            
            // Reset all timers
            faceDetectionStartTime.current = null;
            happyDetectionStartTime.current = null;
            angryDetectionStartTime.current = null;
            blinkDetectionStartTime.current = null;
          } else if (faceLostFrameCount.current < FACE_LOST_THRESHOLD) {
            // Face temporarily lost but within threshold - just log it
            // console.log("⚠️ Face temporarily lost (", faceLostFrameCount.current, "/", FACE_LOST_THRESHOLD, ") - continuing...");
          }
        }
      }
    }, 100);
  };

  const closeWebcam = () => {
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks()[0].stop();
    }

    // Reset all states
    updateFaceDetected(false);
    setBlinkDetected(false);
    updateHappyDetected(false);
    updateAngryDetected(false);
    setLivenessResult("pending");
    updateCurrentStep("face");

    // Reset refs
    eyeClosedFrames.current = 0;
    happyDetectedDuringStep.current = false;
    angryDetectedDuringStep.current = false;
    faceLostFrameCount.current = 0;

    // Reset timing refs
    faceDetectionStartTime.current = null;
    happyDetectionStartTime.current = null;
    angryDetectionStartTime.current = null;
    blinkDetectionStartTime.current = null;

    setCaptureVideo(false);
  };

  // Helper function to get current step instruction
  const getCurrentStepInstruction = () => {
    switch (currentStep) {
      case "face":
        return "📸 Strike a pose! Get your beautiful face in the camera frame";
      case "happy":
        return "😊 Time to channel your inner joy! Give us your biggest, cheesiest smile!";
      case "angry":
        return "😠 Channel your inner villain! Show us your angriest face (don't worry, we won't judge)";
      case "blink":
        return "👀 Perfect! Now give us a nice, slow blink like you're winking at your crush";
      case "complete":
        return "🎉 You're a verification superstar! Mission accomplished!";
      default:
        return "";
    }
  };

  return {
    // State
    faceDetected,
    captureVideo,
    modelsLoaded,
    blinkDetected,
    happyExpressionDetected,
    angryExpressionDetected,
    livenessResult,
    currentStep,

    // Refs
    videoRef,
    canvasRef,

    // Constants
    videoHeight,
    videoWidth,

    // Functions
    startVideo,
    closeWebcam,
    handleVideoOnPlay,
    getCurrentStepInstruction,
  };
};