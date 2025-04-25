import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import { Canvas as NodeCanvas, Image as NodeImage, ImageData as NodeImageData, loadImage } from "canvas";

// Initialize face-api.js with models
export const initModels = async (): Promise<void> => {
  try {
    const MODEL_URL = "public/models"; // Update this to the location where models are stored
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
  } catch (error) {
    console.error("Model loading error:", error);
    throw new Error("Failed to load face-api.js models");
  }
};

// Configure the environment for face-api.js
if (typeof window === "undefined") {
  globalThis.HTMLCanvasElement = NodeCanvas as unknown as typeof HTMLCanvasElement;
  globalThis.HTMLImageElement = NodeImage as unknown as typeof HTMLImageElement;
  globalThis.ImageData = NodeImageData as unknown as typeof globalThis.ImageData;
}

interface CompareResult {
  match: boolean;
  accuracy: string;
  distance: number;
}

// Function to compare two images using face-api.js
export const facecompare = async (image1: Buffer, image2: Buffer): Promise<CompareResult> => {
  try {
    if (!image1 || !image2) {
      throw new Error("Both images are required for comparison");
    }

    // Load images into Canvas
    const img1 = await loadImage(image1);
    const img2 = await loadImage(image2);

    // Detect face descriptors
    const img1Descriptor = await detectFaceDescriptor(img1);
    const img2Descriptor = await detectFaceDescriptor(img2);

    if (!img1Descriptor || !img2Descriptor) {
      throw new Error("Face not detected in one or both images");
    }

    // Compare faces using Euclidean distance
    const distance = faceapi.euclideanDistance(
      img1Descriptor.descriptor,
      img2Descriptor.descriptor
    );

    const maxDistance = 0.5; // Maximum distance threshold for 100% accuracy
    const accuracy = Math.max(0, (1 - distance / maxDistance)) * 100;
    const result: CompareResult = {
      match: accuracy >= 70 || distance < maxDistance,
      accuracy: accuracy.toFixed(2),
      distance,
    };

    return result;
  } catch (error) {
    console.error("Comparison error:", error);
    throw new Error("Error during face comparison");
  }
};

// Utility function to detect face descriptors
const detectFaceDescriptor = async (image: any) => {
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 256, scoreThreshold: 0.5 });
  return await faceapi.detectSingleFace(image, options).withFaceLandmarks().withFaceDescriptor();
};
