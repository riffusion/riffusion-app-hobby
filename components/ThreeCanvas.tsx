import { Canvas } from "@react-three/fiber";

import { InferenceResult } from "../types";
import SpectrogramViewer from "./SpectrogramViewer";

interface CanvasProps {
  paused: boolean;
  inferenceResults: InferenceResult[];
}

/**
 * React three fiber canvas with spectrogram drawing.
 */
export default function ThreeCanvas(props: CanvasProps) {
  return (
    <Canvas camera={{ position: [0, 0, 7], rotation: [0.2, 0, 0] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <SpectrogramViewer
        paused={props.paused}
        inferenceResults={props.inferenceResults}
      />
    </Canvas>
  );
}
