import * as THREE from "three";
import createTouches from "touches";
import SlideNoise from "./SlideNoise";

export default class WebGLApp {
  _tmpTarget = new THREE.Vector3();
  _rafID;
  _lastTime;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  maxPixelRatio: number;
  maxDeltaTime: number;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  gl: WebGLRenderingContext;
  time: number;
  isRunning: boolean;
  touchHandler: {
    on(key: string, callback: (ev: any, pos: any) => void): void;
  };
  width: number;
  height: number;
  pixelRatio: number;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas,
    });
    this.renderer.sortObjects = false;
    this.canvas = this.renderer.domElement;
    this.renderer.setClearColor("#000", 0);
    this.maxPixelRatio = 2;
    this.maxDeltaTime = 1 / 30;
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    this.scene = new THREE.Scene();
    this.gl = this.renderer.getContext();
    this.time = 0;
    this.isRunning = false;
    this._lastTime = performance.now();
    this._rafID = null;
    window.addEventListener("resize", this.resize);
    window.addEventListener("orientationchange", this.resize);
    this.resize();
    this.touchHandler = createTouches(this.canvas, {
      target: this.canvas,
      filtered: true,
    });
    this.touchHandler.on("start", (ev, pos) =>
      this.traverse("onPointerDown", ev, pos)
    );
    this.touchHandler.on("move", (ev, pos) =>
      this.traverse("onPointerMove", ev, pos)
    );
    this.touchHandler.on("end", (ev, pos) =>
      this.traverse("onPointerUp", ev, pos)
    );
    const image = "image.png";
    const loader = new THREE.TextureLoader();
    loader.load(image, texture => {
      texture.name = image;
      texture.encoding = THREE.LinearEncoding;
      texture.format = THREE.RGBAFormat;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      this.renderer.initTexture(texture);
      this.camera.position.set(0, 0, 5);
      const position = new THREE.Vector3(0, 10, 10);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.copy(position);
      this.scene.add(directionalLight);
      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.9);
      this.scene.add(ambientLight);
      const slide = new SlideNoise(this, texture);
      slide.animateTo(0.5);
      this.scene.add(slide);
      this.start();
      this.draw();
    });
  }

  resize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(this.maxPixelRatio, window.devicePixelRatio);

    if (this.renderer.getPixelRatio() !== this.pixelRatio) {
      this.renderer.setPixelRatio(this.pixelRatio);
    }
    this.renderer.setSize(this.width, this.height);
    if (this.camera.isPerspectiveCamera) {
      this.camera.aspect = this.width / this.height;
    }
    this.camera.updateProjectionMatrix();
    this.draw();
    return this;
  };

  update = (dt, time) => {
    this.scene.traverse(obj => {
      if (obj instanceof SlideNoise) {
        obj.update(dt, time);
      }
    });
    return this;
  };

  draw = () => {
    this.renderer.render(this.scene, this.camera);
    return this;
  };

  start = () => {
    if (this._rafID !== null) {
      return;
    }
    this._rafID = window.requestAnimationFrame(this.animate);
    this.isRunning = true;
    return this;
  };

  stop = () => {
    if (this._rafID === null) {
      return;
    }
    window.cancelAnimationFrame(this._rafID);
    this._rafID = null;
    this.isRunning = false;
    return this;
  };

  animate = () => {
    if (!this.isRunning) return;
    window.requestAnimationFrame(this.animate);

    const now = performance.now();
    const dt = Math.min(this.maxDeltaTime, (now - this._lastTime) / 1000);
    this.time += dt;
    this._lastTime = now;
    this.update(dt, this.time);
    this.draw();
  };

  traverse = (fn, ...args) => {
    this.scene.traverse(child => {
      if (typeof child[fn] === "function") {
        child[fn].apply(child, args);
      }
    });
  };
}
