"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import type { DestinationId } from "@/content/schema";
import { anchors } from "@/lib/physics/space";

/**
 * Parks a scene at its region anchor and stops drawing it from far away.
 *
 * The world is a single coordinate space and the canvas never unmounts,
 * so without this every region would issue draw calls from the other end
 * of the universe. Toggling `visible` rather than unmounting keeps the
 * GPU buffers alive: arriving at a region should cost nothing, because
 * the reader is already moving when it appears.
 *
 * The threshold is deliberately generous. Regions are 60 to 220 units
 * apart and the camera sits 45 to 90 units out from the one it is
 * framing, so anything switching on does so well outside the frame --
 * you should never catch a region appearing.
 */
const VISIBLE_WITHIN = 260;

export function Region({
  id,
  children,
}: {
  id: DestinationId;
  children: ReactNode;
}) {
  const ref = useRef<Group>(null);
  const [x, y, z] = anchors[id];

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    group.visible =
      state.camera.position.distanceTo(group.position) < VISIBLE_WITHIN;
  });

  return (
    <group ref={ref} position={[x, y, z]}>
      {children}
    </group>
  );
}
