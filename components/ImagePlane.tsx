import * as THREE from "three";
import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";

interface ImagePlaneProps {
  url: string;
};

/**
 * Draw an image on a plane geometry.
 */
export default function ImagePlane(props: ImagePlaneProps) {
  const texture = useLoader(THREE.TextureLoader, props.url);
  return (
    <Suspense fallback={null}>
      <mesh rotation-z={-Math.PI / 2}>
        <planeBufferGeometry attach="geometry" args={[150, 30]} />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
    </Suspense>
  );
}
