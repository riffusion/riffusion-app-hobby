import { Canvas } from "@react-three/fiber";

import { InferenceResult } from "../types";
import SpectrogramViewer from "./SpectrogramViewer";

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
    <Canvas camera={{ position: [0, 0, 7], rotation: [0.4, 0, 0] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <SpectrogramViewer
        paused={paused}
        inferenceResults={inferenceResults}
        getTime={getTime}
        audioLength={audioLength}
      />
    </Canvas>
  );
}
