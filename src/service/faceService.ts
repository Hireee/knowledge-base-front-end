import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import { Canvas as NodeCanvas, Image as NodeImage, ImageData as NodeImageData, loadImage } from 'canvas';
import { Response } from 'express';

// Initialize face-api.js with models
export const initModels = async (): Promise<void> => {
  try {
    // Load models, make sure you download the models locally or load them from a URL
    const MODEL_URL = 'public/models'; // Update this to the location where models are stored
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
  } catch (error) {
    console.error('Model loading error:', error);
    throw new Error('Failed to load face-api.js models');
  }
};

// Override the global environment for face-api.js using Node.js substitutes
if (typeof window === 'undefined') {
  // @ts-ignore: Overriding global types
  globalThis.HTMLCanvasElement = NodeCanvas as unknown as typeof HTMLCanvasElement;
  // @ts-ignore: Overriding global types
  globalThis.HTMLImageElement = NodeImage as unknown as typeof HTMLImageElement;
  // @ts-ignore: Overriding global types
  globalThis.ImageData = NodeImageData as unknown as typeof globalThis.ImageData;
}

// Configure the environment for face-api.js
faceapi.env.monkeyPatch({
  Canvas: NodeCanvas as unknown as typeof HTMLCanvasElement,
  Image: NodeImage as unknown as typeof HTMLImageElement,
  ImageData: NodeImageData as unknown as typeof globalThis.ImageData,
});

interface CompareResult {
  match: boolean;
  accuracy: string;
  distance: number;
}

// Function to compare two images using face-api.js
export const facecompare = async (
  image1: any, 
  image2: any, 
)=> {
  try {
    if (!image1 || !image2) {
      return  { error: 'Please upload two images' }
    }
console.log("compare", image1, image2);

    // Access the uploaded images and get the raw buffer data
    const image1Buffer: Buffer = image1;
    const image2Buffer: Buffer = image2;

    // Create Canvas images using node-canvas
    const img1 = await loadImage(image1Buffer);
    const img2 = await loadImage(image2Buffer);

    // Detect face descriptors
    const img1Descriptor = await detectFaceDescriptor(img1);
    const img2Descriptor = await detectFaceDescriptor(img2);

    if (!img1Descriptor || !img2Descriptor) {
      throw new Error("Face not detected in one or both images")
    }

    // Compare faces using Euclidean distance
    const distance: number = faceapi.euclideanDistance(
        img1Descriptor.descriptor, 
        img2Descriptor.descriptor
    );

    const maxDistance = 0.6; // Maximum distance threshold for 100% accuracy (adjust based on your model's behavior)
    const accuracy = Math.max(0, (1 - distance / maxDistance)) * 100; // Calculate accuracy percentage
    const accuracyThreshold = 70; // Set an accuracy threshold for a match
    const distanceThreshold = 0.6; // Adjust the maximum distance for a match

    // Prepare the comparison result
    const result: CompareResult = {
      match: accuracy >= accuracyThreshold || distance < distanceThreshold,
      accuracy: accuracy.toFixed(2),
      distance
    };

    return result

  } catch (error) {
    console.error('Comparison error:', error);
    throw error;
  }
};

// Utility function to detect face descriptors
const detectFaceDescriptor = async (image: any) => {
  try {
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 256, scoreThreshold: 0.5 });
    const results = await faceapi.detectSingleFace(image,options).withFaceLandmarks().withFaceDescriptor();
    return results;
  } catch (error) {
    console.error('Face detection error:', error);
    return null;
  }
};
