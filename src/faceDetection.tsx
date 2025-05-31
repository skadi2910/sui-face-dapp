import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";


export const FaceDetection = () => {
  const [faceDetected, setFaceDetected] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoHeight = 480;
  const videoWidth = 640;

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    }
  })

  return <div>FaceDetection</div>;
};