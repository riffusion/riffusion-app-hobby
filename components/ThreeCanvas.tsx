import { Canvas } from "@react-three/fiber";

import RotatingBox from "./RotatingBox";
import ImagePlane from "./ImagePlane";

interface CanvasProps {
  paused: boolean;
}

/**
 * React three fiber canvas with spectrogram drawing.
 */
export default function ThreeCanvas(props: CanvasProps) {
  // change the image URL
  const spectrogram_image = "spectrogram.jpeg";

  const height = -30.0;

  return (
    <Canvas camera={{ position: [0, 0, 35], rotation: [0.2, 0, 0] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <ImagePlane
        url={spectrogram_image}
        height={height}
        paused={props.paused}
      />
      <RotatingBox position={[-12, 0, 1]} />
      <RotatingBox position={[-4, 0, 1]} />
      <RotatingBox position={[4, 0, 1]} />
      <RotatingBox position={[12, 0, 1]} />
    </Canvas>
  );
}
