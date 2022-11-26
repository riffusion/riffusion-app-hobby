import { Canvas } from "@react-three/fiber";

import { InferenceResult } from "../types";
import SpectrogramViewer from "./SpectrogramViewer";
import { PerspectiveCamera } from "@react-three/drei";

interface CanvasProps {
  paused: boolean;
  inferenceResults: InferenceResult[];
  getTime: () => number;
  audioLength: number;
}

/**
 * React three fiber canvas with spectrogram drawing.
 */
export default function ThreeCanvas({
  paused,
  inferenceResults,
  getTime,
  audioLength,
}: CanvasProps) {
  return (
    <Canvas>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 8]}
        rotation={[0.4, 0, 0]}
        fov={70}
      />

      <SpectrogramViewer
        paused={paused}
        inferenceResults={inferenceResults}
        getTime={getTime}
        audioLength={audioLength}
      />
    </Canvas>
  );
}
