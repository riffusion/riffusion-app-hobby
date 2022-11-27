import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Box } from "@react-three/drei";

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
  const { camera } = useThree();

  const playheadRef = useRef(null);

  // Move the camera based on the clock
  useFrame(() => {
    const time = getTime();

    const velocity = -1.0; // [m/s]
    const position = velocity * time; // [m]

    camera.position.y = position;
    playheadRef.current.position.y = camera.position.y;
  });

  const playbarShift = 3.6; // [m]

  return (
    <group>
      {inferenceResults.map((value: InferenceResult, index: number) => {
        const position = audioLength * (-0.6 - value.counter) + playbarShift;
        if (use_height_map) {
          return (
            <HeightMapImage
              url={value.image}
              position={[0, position, 0]}
              rotation={[0, 0, -Math.PI / 2]}
              scale={[audioLength, 5, 1]}
              key={index}
            />
          );
        } else {
          return (
            <ImagePlane
              url={value.image}
              height={position}
              duration={audioLength}
              key={index}
            />
          );
        }
      })}

      {/* Playhead as as transparent red box. */}
      {/* TODO(hayk): Synchronize this better with the audio. */}
      <group ref={playheadRef}>
        <Box
          args={[5.5, 2.0, 0.15]}
          rotation={[Math.PI / 2 - 0.2, 0, 0]}
          position={[0, playbarShift, -0.5]}
        >
          <meshBasicMaterial color="#ee2211" transparent opacity={0.8} />
        </Box>
      </group>
    </group>
  );
}
