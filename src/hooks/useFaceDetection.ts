import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export const useFaceDetection = () => {
  // State management
  const [faceDetected, setFaceDetected] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [headMovementDetected, setHeadMovementDetected] = useState(false);
  const [livenessResult, setLivenessResult] = useState<
    "pending" | "pass" | "fail"
  >("pending");

  // Current step tracking
  const [currentStep, setCurrentStep] = useState<
    "face" | "movement" | "blink" | "complete"
  >("face");

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousPosition = useRef<{ x: number; y: number } | null>(null);
  const eyeClosedFrames = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const movementFrameCounter = useRef(0);
  const recentPositions = useRef<{ x: number; y: number }[]>([]); // Add new ref for tracking recent positions

  // Constants
  const videoHeight = 400;
  const videoWidth = 300;
  const movementThreshold = 10;
  const blinkThreshold = 1;
  const earThreshold = 0.28;

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

  const startVideo = () => {
    // Reset all detection states for fresh start
    setFaceDetected(false);
    setBlinkDetected(false);
    setHeadMovementDetected(false);
    setLivenessResult("pending");
    setCurrentStep("face");

    // Reset refs
    previousPosition.current = null;
    eyeClosedFrames.current = 0;
    movementFrameCounter.current = 0;
    recentPositions.current = []; // Reset recent positions

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
      if (livenessResult === "pass" && currentStep === "complete") {
        console.log("🎯 Verification complete - stopping detection processing");
        return;
      }
      if (canvasRef && canvasRef.current && videoRef.current) {
        // Check if video is ready
        if (videoRef.current.readyState !== 4) {
          return;
        }

        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        canvasRef.current.getContext("2d")?.drawImage(canvas, 0, 0);

        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions(),
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length > 0) {
          const landmarks = detections[0].landmarks;
          const faceCenter = {
            x: (landmarks.positions[27].x + landmarks.positions[30].x) / 2,
            y: (landmarks.positions[27].y + landmarks.positions[30].y) / 2,
          };

          // Use local variables to track current state within this cycle
          let localStep = currentStep;
          let localFaceDetected = faceDetected;
          let localHeadMovement = headMovementDetected;
          let localBlink = blinkDetected;

          // Step 1: Face Detection
          if (localStep === "face" && !localFaceDetected) {
            console.log("✅ Step 1: Face detected");
            setFaceDetected(true);
            localFaceDetected = true;
            setCurrentStep("movement");
            localStep = "movement";
            console.log("Moving to movement step");
          }

          // Step 2: Head Movement Detection
          if (
            localStep === "movement" &&
            localFaceDetected &&
            !localHeadMovement
          ) {
            // Store current position in recent positions array
            recentPositions.current.push(faceCenter);

            // Keep only last 10 positions (1 second of history)
            if (recentPositions.current.length > 10) {
              recentPositions.current.shift();
            }

            movementFrameCounter.current++;
            console.log(
              "Movement check - Frame:",
              movementFrameCounter.current,
            );

            if (
              movementFrameCounter.current > 5 &&
              recentPositions.current.length >= 5
            ) {
              // Compare current position with position from 5 frames ago
              const oldPosition = recentPositions.current[0];
              const currentPosition = faceCenter;

              console.log("=== MOVEMENT CALCULATION DEBUG ===");
              console.log("Current position:", currentPosition);
              console.log("Position from 5 frames ago:", oldPosition);

              const distance = Math.sqrt(
                Math.pow(currentPosition.x - oldPosition.x, 2) +
                  Math.pow(currentPosition.y - oldPosition.y, 2),
              );

              console.log("Distance over time:", distance);
              console.log("Threshold:", movementThreshold);
              console.log("=== END DEBUG ===");

              if (distance > movementThreshold) {
                console.log("✅ Step 2: Head movement detected");
                setHeadMovementDetected(true);
                localHeadMovement = true;
                setCurrentStep("blink");
                localStep = "blink";
                console.log("Moving to blink step");
              } else {
                console.log("Not enough movement detected over time");
              }
            } else {
              console.log(
                "Collecting position data, frame:",
                movementFrameCounter.current,
              );
            }
          }

          // Step 3: Blink Detection
          if (
            localStep === "blink" &&
            localFaceDetected &&
            localHeadMovement &&
            !localBlink
          ) {
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            const leftEAR = calculateEAR(leftEye);
            const rightEAR = calculateEAR(rightEye);
            const avgEAR = (leftEAR + rightEAR) / 2;

            console.log("EAR:", avgEAR.toFixed(3), "Threshold:", earThreshold);

            if (avgEAR < earThreshold) {
              eyeClosedFrames.current++;
            } else {
              if (eyeClosedFrames.current >= blinkThreshold) {
                console.log("✅ Step 3: Blink detected");
                setBlinkDetected(true);
                setCurrentStep("complete");
                setLivenessResult("pass");
                console.log("🎉 ALL STEPS COMPLETED - LIVENESS CHECK PASSED");
                console.log("🛑 Stopping all detection processing...");

                // Stop the interval completely after verification is complete
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                return; // Exit immediately
              }
              eyeClosedFrames.current = 0;
            }
          }
        } else {
          // Face lost - reset everything
          if (currentStep !== "face") {
            console.log("❌ Face lost - restarting from step 1");
            setFaceDetected(false);
            setBlinkDetected(false);
            setHeadMovementDetected(false);
            setLivenessResult("pending");
            setCurrentStep("face");
            previousPosition.current = null;
            eyeClosedFrames.current = 0;
            movementFrameCounter.current = 0;
            recentPositions.current = []; // Reset recent positions
          }
        }

        // Draw detections
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize,
        );
        canvasRef.current
          ?.getContext("2d")
          ?.clearRect(0, 0, videoWidth, videoHeight);

        if (resizedDetections.length > 0) {
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(
            canvasRef.current,
            resizedDetections,
          );
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
    setFaceDetected(false);
    setBlinkDetected(false);
    setHeadMovementDetected(false);
    setLivenessResult("pending");
    setCurrentStep("face");

    // Reset refs
    previousPosition.current = null;
    eyeClosedFrames.current = 0;
    movementFrameCounter.current = 0;
    recentPositions.current = []; // Reset recent positions

    setCaptureVideo(false);
  };

  // Helper function to get current step instruction
  const getCurrentStepInstruction = () => {
    switch (currentStep) {
      case "face":
        return "Please position your face in the camera";
      case "movement":
        return "Please move your head slowly";
      case "blink":
        return "Please blink your eyes";
      case "complete":
        return "Verification complete!";
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
    headMovementDetected,
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
