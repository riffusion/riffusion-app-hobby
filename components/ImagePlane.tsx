import * as THREE from "three";
import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";

interface ImagePlaneProps {
  url: string;
  height: number;
  duration: number;
}

/**
 * Draw an image on a plane geometry.
 */
export default function ImagePlane(props: ImagePlaneProps) {
  const texture = useLoader(THREE.TextureLoader, props.url);

  return (
    <Suspense fallback={null}>
      <mesh rotation-z={-Math.PI / 2} position-y={props.height}>
        <planeGeometry attach="geometry" args={[props.duration, 5]} />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
    </Suspense>
  );
}
