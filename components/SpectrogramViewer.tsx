import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { QuadraticBezierLine, Plane } from "@react-three/drei";

import { InferenceResult } from "../types";
import HeightMapImage from "./HeightMapImage";
import ImagePlane from "./ImagePlane";

interface SpectrogramViewerProps {
  paused: boolean;
  inferenceResults: InferenceResult[];
  getTime: () => number;
  use_height_map?: boolean;
  audioLength: number;
}

/**
 * Spectrogram drawing code.
 */
export default function SpectrogramViewer({
  paused,
  inferenceResults,
  getTime,
  audioLength,
  use_height_map = true,
}: SpectrogramViewerProps) {
  const camera = useThree((state) => state.camera);

  const playheadRef = useRef(null);

  // Move the camera based on the clock
  useFrame(() => {
    const time = getTime();

    const velocity = -1.0; // [m/s]
    const position = velocity * time; // [m]

    camera.position.y = position;
    playheadRef.current.position.y = camera.position.y;
  });

  return (
    <group>
      {inferenceResults.map((value: InferenceResult, index: number) => {
        const height = audioLength * (-0.48 - value.counter);

        if (use_height_map) {
          return (
            <HeightMapImage
              url={value.image}
              position={[0, height, 0]}
              rotation={[0, 0, -Math.PI / 2]}
              scale={[audioLength, 5, 1]}
              key={index}
            />
          );
        } else {
          return <ImagePlane url={value.image} height={height} key={index} />;
        }
      })}

      {/* TODO make into playhead component */}
      <group ref={playheadRef}>
        <Plane
          args={[5.5, 2.0]}
          rotation={[Math.PI / 2 - 0.4, 0, 0]}
          position={[0, 0, -0.5]}
        >
          <meshBasicMaterial color="#ee2211" transparent opacity={0.8} />
        </Plane>

        {/* <QuadraticBezierLine
          start={[-3, 0, 1]} // Starting point, can be an array or a vec3
          end={[3, 0, 1]} // Ending point, can be an array or a vec3
          mid={[0, -0.8, 0.4]} // Optional control point, can be an array or a vec3
          color="#aa3333" // Default
          lineWidth={5} // In pixels (default)
          dashed={false} // Default
        /> */}
      </group>
    </group>
  );
}
