import * as THREE from "three";
import React, { useRef, Suspense } from "react";
import { useLoader, useFrame } from "@react-three/fiber";

interface ImagePlaneProps {
  url: string;
  height: number;
  paused: boolean;
}

/**
 * Draw an image on a plane geometry.
 */
export default function ImagePlane(props: ImagePlaneProps) {
  const texture = useLoader(THREE.TextureLoader, props.url);

  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (props.paused) {
      return;
    }

    mesh.current.position.y += 1 / 30.0;
  });

  return (
    <Suspense fallback={null}>
      <mesh ref={mesh} rotation-z={-Math.PI / 2} position-y={props.height}>
        <planeBufferGeometry attach="geometry" args={[30, 30]} />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
    </Suspense>
  );
}
