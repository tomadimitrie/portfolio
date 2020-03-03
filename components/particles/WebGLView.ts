import React from "react";
import * as THREE from "three";
import InteractiveControls from "./InteractiveControls";
import Particles from "./Particles";
import Constants from "../../constants";

export default class WebGLView {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  interactive: InteractiveControls;
  particles: Particles;
  fovHeight: number;
  fovWidth: number;

  constructor(parent: React.MutableRefObject<HTMLDivElement>) {
    this.initThree();
    this.initParticles();
    this.initControls();
    parent.current.appendChild(this.renderer.domElement);
    this.animate();
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  initThree = () => {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / (window.innerHeight - Constants.navHeight),
      1,
      10000
    );
    this.camera.position.z = 300;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.clock = new THREE.Clock(true);
  };

  initControls = () => {
    this.interactive = new InteractiveControls(
      this.camera,
      this.renderer.domElement
    );
  };

  initParticles = () => {
    this.particles = new Particles(this);
    this.scene.add(this.particles.container);
  };

  update = () => {
    const delta = this.clock.getDelta();

    if (this.particles) {
      this.particles.update(delta);
    }
  };

  draw = () => {
    this.renderer.render(this.scene, this.camera);
  };

  resize = () => {
    this.camera.aspect =
      window.innerWidth / (window.innerHeight - Constants.navHeight);
    this.camera.updateProjectionMatrix();

    this.fovHeight =
      2 *
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
      this.camera.position.z;

    this.fovWidth = this.fovHeight * this.camera.aspect;

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight - Constants.navHeight
    );
    this.interactive.resize();
    this.particles.resize();
  };

  animate = () => {
    this.update();
    this.draw();
    requestAnimationFrame(this.animate);
  };
}
