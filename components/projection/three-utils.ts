import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

export function alignOnCurve(object, curve, percentage) {
  const point = curve.getPoint(percentage);
  object.position.copy(point);
  const tangent = curve.getTangent(percentage).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
  const radians = Math.acos(up.dot(tangent));
  object.quaternion.setFromAxisAngle(axis, radians);
}

export function visibleHeightAtZDepth(depth, camera) {
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) {
    depth -= cameraOffset;
  } else {
    depth += cameraOffset;
  }
  const vFOV = (camera.fov * Math.PI) / 180;
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
}

export function visibleWidthAtZDepth(depth, camera) {
  const height = visibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
}

export function mouseToCoordinates({
  x,
  y,
  targetZ = 0,
  camera,
  width,
  height,
}) {
  const vec = new THREE.Vector3();
  const pos = new THREE.Vector3();
  vec.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  const distance = (targetZ - camera.position.z) / vec.z;
  pos.copy(camera.position).add(vec.multiplyScalar(distance));
  return pos;
}

export function extractGeometry(gltf) {
  const geometries = [];
  gltf.traverse(child => {
    if (child.isMesh) {
      geometries.push(child.geometry);
    }
  });
  return BufferGeometryUtils.mergeBufferGeometries(geometries);
}
