import { DoubleSide, RepeatWrapping, sRGBEncoding } from "three";
import {
  useTexture,
} from "@react-three/drei";

import { vertexShader, fragmentShader } from "../shaders";

interface HeightMapImageProps {
    url: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }

export default function HeightMapImage(props: HeightMapImageProps) {
  const url = props.url;

  // Load the heightmap image
  const heightMap = useTexture(url);
  heightMap.wrapS = RepeatWrapping;
  heightMap.wrapT = RepeatWrapping;

  // Load the texture map
  const textureMap = useTexture(url);
  textureMap.wrapS = RepeatWrapping;
  textureMap.wrapT = RepeatWrapping;

  return (
    <mesh
      position={props.position}
      rotation={props.rotation}
      scale={props.scale}
    >
      {/* TODO hayk reduce */}
      <planeGeometry args={[1, 1, 256, 256]} />
      <shaderMaterial
        uniforms={{
          // Feed the heightmap
          bumpTexture: { value: heightMap },
          // Feed the scaling constant for the heightmap
          bumpScale: { value: -0.1 },
          // Feed the texture map
          terrainTexture: { value: textureMap },
        }}
        // Feed the shaders as strings
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
      />
    </mesh>
  );
}
