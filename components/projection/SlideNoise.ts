import * as THREE from "three";
import { clamp01, lerp, mapRange } from "canvas-sketch-util/math";
import * as eases from "eases";
import ProjectedMaterial, {
  allocateProjectionData,
  projectInstanceAt,
} from "three-projected-material";
import {
  alignOnCurve,
  mouseToCoordinates,
  visibleHeightAtZDepth,
  visibleWidthAtZDepth,
} from "./three-utils";
import { mapRangeTriple, noise, poisson } from "./utils";
import WebGLApp from "./WebGLApp";
import Poisson from "poisson-disk-sampling";

export const ANIMATION_DURATION = 1;

const TEXTURE_SCALE = 1;

const STARTING_Z = -1;

export default class SlideNoise extends THREE.Group {
  webgl: WebGLApp;
  texture: THREE.Texture;
  width: number;
  height: number;
  points: Poisson;
  NUM_INSTANCES: number;
  instancedMesh;
  dummy = new THREE.Object3D();
  delays = [];
  curves = [];
  targetCurves = [];
  previousPercentages = [];
  percentages = [];
  targetPercentage = 0;
  mousePoint: THREE.Vector3;
  tStart: number;

  constructor(webgl: WebGLApp, texture: any) {
    super();
    this.webgl = webgl;
    this.texture = texture;
    const ratio = texture.image.width / texture.image.height;
    this.height = visibleHeightAtZDepth(5, webgl.camera) * TEXTURE_SCALE;
    this.width = this.height * ratio;

    this.points = poisson([this.width, this.height], 7.73, 9.66);

    this.points = this.points.filter(([x, y]) => {
      return (
        x >=
          (Math.sin(y * 3) * Math.sin(y * 2) * Math.sin(y * 4.7) * 0.5 + 0.5) *
            0.7 &&
        x <=
          (Math.sin(y * 3) * Math.sin(y * 2) * Math.sin(y * 4.7) * 0.5 - 0.5) *
            0.7 +
            this.width
      );
    });

    this.points = this.points.map(point => [
      point[0] - this.width / 2,
      point[1] - this.height / 2,
    ]);

    this.NUM_INSTANCES = this.points.length;

    const geometry = new THREE.BoxBufferGeometry(0.1, 0.2, 0.1);
    const material = new ProjectedMaterial({
      camera: webgl.camera,
      texture,
      textureScale: TEXTURE_SCALE,
      color: new THREE.Color("#000000"),
      instanced: true,
      cover: true,
    });

    allocateProjectionData(geometry, this.NUM_INSTANCES);

    this.instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.NUM_INSTANCES
    );
    this.add(this.instancedMesh);

    const minX =
      -visibleWidthAtZDepth(STARTING_Z, this.webgl.camera) / 2 -
      this.width * 0.6;

    this.points.forEach((point, i) => {
      const [x, y] = point;
      const curvePoints = this.generateCurve(x, y, 0, minX);
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      this.curves.push(curve);
      // no ts support for clone?
      this.targetCurves.push((curve as any).clone());
      const delay = this.generateDelay(x, y);
      this.delays.push(delay);
      alignOnCurve(this.dummy, curve, 0.5);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      this.dummy.updateMatrixWorld();
      projectInstanceAt(i, this.instancedMesh, this.dummy.matrixWorld);
      alignOnCurve(this.dummy, curve, 0);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    });
    this.delays = this.normalizeDelays(this.delays);
    this.percentages.length = this.NUM_INSTANCES;
    this.percentages.fill(0);
  }

  onPointerMove(event, [x, y]) {
    this.mousePoint = mouseToCoordinates({
      x,
      y,
      camera: this.webgl.camera,
      width: this.webgl.width,
      height: this.webgl.height,
      targetZ: -0.1,
    });
  }

  generateCurve(x, y, z, minX) {
    const points = [];
    const segments = 51;
    const halfIndex = (segments - 1) / 2;
    const startX = minX;
    const endX = minX * -1;
    const startZ = STARTING_Z;
    const endZ = startZ;
    for (let i = 0; i < segments; i++) {
      const offsetX = mapRange(i, 0, segments - 1, startX, endX);
      const noiseAmount = mapRangeTriple(
        i,
        0,
        halfIndex,
        segments - 1,
        1,
        0,
        1
      );
      const frequency = 0.25;
      const noiseAmplitude = 0.6;
      const noiseY =
        noise(offsetX * frequency) *
        noiseAmplitude *
        eases.quartOut(noiseAmount);
      const scaleY = mapRange(eases.quartIn(1 - noiseAmount), 0, 1, 0.2, 1);
      const offsetZ = mapRangeTriple(
        i,
        0,
        halfIndex,
        segments - 1,
        startZ,
        0,
        endZ
      );
      points.push(
        new THREE.Vector3(x + offsetX, y * scaleY + noiseY, z + offsetZ)
      );
    }
    return points;
  }

  generateDelay(x, y) {
    const delayFactor = 1.5;
    const frequency = 0.5;
    return (noise(x * frequency, y * frequency) * 0.5 + 0.5) * delayFactor;
  }

  normalizeDelays = delays => {
    const minDelay = Math.min(...delays);
    return delays.map(delay => delay - minDelay);
  };

  animateTo = percentage => {
    this.tStart = this.webgl.time;
    this.previousPercentages = this.percentages.slice();
    this.targetPercentage = percentage;
  };

  moveTo = percentage => {
    this.percentages.fill(percentage);
    this.targetPercentage = percentage;
  };

  update(dt, time) {
    const displacement = 0.6;

    for (let i = 0; i < this.NUM_INSTANCES; i++) {
      const curve = this.curves[i];
      const targetCurve = this.targetCurves[i];
      const delay = this.delays[i];

      if (this.tStart !== undefined) {
        const delayDelay = 0.5; // ✨ magic number
        this.percentages[i] = lerp(
          this.previousPercentages[i],
          this.targetPercentage,
          clamp01(
            (time - (this.tStart + delay * delayDelay)) /
              (ANIMATION_DURATION + delay * (1 - delayDelay))
          )
        );
      }
      if (this.percentages[i] > 0 && this.percentages[i] < 1) {
        curve.points.forEach((point, j) => {
          const { x, y } = point;
          const targetPoint = targetCurve.points[j];
          if (this.mousePoint) {
            if (point.distanceTo(this.mousePoint) < displacement) {
              const direction = point.clone().sub(this.mousePoint);
              const displacementAmount = displacement - direction.length();
              direction.setLength(displacementAmount);
              direction.add(point);
              point.lerp(direction, 0.2); // ✨ magic number
            }
            if (point.distanceTo(targetPoint) > 0.01) {
              point.lerp(targetPoint, 0.27); // ✨ magic number
            }
          }
          const speed = 0.2;
          const frequency = 0.5;
          const amplitude = 0.2;
          const z =
            noise(x * frequency - time * speed, y * frequency) * amplitude;
          point.z = targetPoint.z + z;
        });
      }
      alignOnCurve(this.dummy, curve, this.percentages[i]);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      this.instancedMesh.instanceMatrix.needsUpdate = true;
    }
  }

  resize = () => {

  }
}
