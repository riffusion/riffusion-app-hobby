import { Canvas } from "@react-three/fiber";

import RotatingBox from "./RotatingBox";
import ImagePlane from "./ImagePlane";

/**
 * React three fiber canvas with spectrogram drawing.
 */
export default function ThreeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 35] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <ImagePlane url={"spectrogram_example.png"} />
      <RotatingBox position={[-12, 0, 1]} />
      <RotatingBox position={[-4, 0, 1]} />
      <RotatingBox position={[4, 0, 1]} />
      <RotatingBox position={[12, 0, 1]} />
    </Canvas>
  );
}
