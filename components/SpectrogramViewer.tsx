import ImagePlane from "./ImagePlane";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { InferenceResult } from "../types";
import { QuadraticBezierLine } from "@react-three/drei";

interface SpectrogramViewerProps {
  paused: boolean;
  inferenceResults: InferenceResult[];
}

/**
 * Spectrogram drawing code.
 */
export default function SpectrogramViewer(props: SpectrogramViewerProps) {
  const paused = props.paused;
  const inferenceResults = props.inferenceResults;

  const camera = useThree((state) => state.camera);

  const playheadRef = useRef(null);

  // Move the camera and playhead every frame.
  useFrame(() => {
    if (paused) {
      return;
    }

    const framerate = 120.0;
    camera.position.y -= 1 / framerate;
    playheadRef.current.position.y -= 1 / framerate;
  });

  return (
    <group>
      {inferenceResults.map((value: InferenceResult, index: number) => {
        const height = 5 * (-1 - value.counter) - 2;
        return <ImagePlane url={value.image} height={height} key={index} />;
      })}

      {/* TODO make into playhead component */}
      <group ref={playheadRef}>
        <QuadraticBezierLine
          start={[-3, 0, 1]} // Starting point, can be an array or a vec3
          end={[3, 0, 1]} // Ending point, can be an array or a vec3
          mid={[0, -0.8, 0.4]} // Optional control point, can be an array or a vec3
          color="#aa3333" // Default
          lineWidth={5} // In pixels (default)
          dashed={false} // Default
        />
      </group>
    </group>
  );
}
