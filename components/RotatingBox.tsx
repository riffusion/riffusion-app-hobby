import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame, GroupProps } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

/**
 * Component to draw rotating boxes.
 */
export default function RotatingBox(props: JSX.IntrinsicElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null);

  // Track whether the boxes are hovered over and clicked
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate the meshes every animation frame
  useFrame(() => {
    mesh.current.rotation.y += 0.01;
    mesh.current.rotation.x += 0.01;
  });

  return (
    <RoundedBox
      // @ts-ignore
      args={[1, 1, 1]}
      radius={0.1}
      smoothness={4}
      {...props}
      ref={mesh}
      scale={active ? [.3, .3, .3] : [.2, .2, .2]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial
        attach="material"
        color={hovered ? "#2b6c76" : "#720b23"}
      />
    </RoundedBox>
  );
}
