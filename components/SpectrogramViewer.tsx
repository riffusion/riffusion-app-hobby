import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";

import { InferenceResult } from "../types";
import HeightMapImage from "./HeightMapImage";
import ImagePlane from "./ImagePlane";

interface SpectrogramViewerProps {
  paused: boolean;
  inferenceResults: InferenceResult[];
  use_height_map?: boolean;
}

/**
 * Spectrogram drawing code.
 */
export default function SpectrogramViewer({
  paused,
  inferenceResults,
  use_height_map = true,
}: SpectrogramViewerProps) {
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

        if (use_height_map) {
          return (
            <HeightMapImage
              url={value.image}
              position={[0, height, 0]}
              rotation={[0, 0, -Math.PI / 2]}
              scale={[5, 5, 5]}
              key={index}
            />
          );
        } else {
          return <ImagePlane url={value.image} height={height} key={index} />;
        }
      })}

      {/* TODO make into playhead component */}
      <group ref={playheadRef}>
        <QuadraticBezierLine
          start={[-3, 0, 1]} // Starting point, can be an array or a vec3
          end={[3, 0, 1]} // Ending point, can be an array or a vec3
          mid={[0, -0.8, 0.4]} // Optional control point, can be an array or a vec3
          color="#DD1C1A" // Default
          lineWidth={5} // In pixels (default)
          dashed={false} // Default
        />
      </group>
    </group>
  );
}
