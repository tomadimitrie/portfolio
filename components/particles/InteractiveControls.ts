import EventEmitter from "events";
import * as THREE from "three";
import Constants from "../../constants";

export default class InteractiveControls extends EventEmitter.EventEmitter {
  enabled: boolean;
  camera: THREE.Camera;
  el: HTMLCanvasElement;
  plane: THREE.Plane;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  offset: THREE.Vector3;
  intersection: THREE.Vector3;
  objects: THREE.Object3D[];
  hovered: THREE.Object3D | null;
  selected: THREE.Object3D | null;
  isDown: boolean;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  intersectionData: THREE.Intersection;

  constructor(camera: THREE.Camera, el: HTMLCanvasElement) {
    super();
    this.camera = camera;
    this.el = el;
    this.plane = new THREE.Plane();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.intersection = new THREE.Vector3();
    this.objects = [];
    this.hovered = null;
    this.selected = null;
    this.isDown = false;
    this.addListeners();
  }

  enable = () => {
    if (this.enabled) {
      return;
    }
    this.enabled = true;
  };

  disable = () => {
    if (!this.enabled) {
      return;
    }
    this.removeListeners();
    this.enabled = false;
  };

  addListeners = () => {
    this.el.addEventListener("touchstart", this.onDown);
    this.el.addEventListener("touchmove", this.onMove);
    this.el.addEventListener("touchend", this.onUp);
    this.el.addEventListener("mousedown", this.onDown);
    this.el.addEventListener("mousemove", this.onMove);
    this.el.addEventListener("mouseup", this.onUp);
    this.el.addEventListener("mouseleave", this.onLeave);
  };

  removeListeners = () => {
    this.el.removeEventListener("touchstart", this.onDown);
    this.el.removeEventListener("touchmove", this.onMove);
    this.el.removeEventListener("touchend", this.onUp);
    this.el.removeEventListener("mousedown", this.onDown);
    this.el.removeEventListener("mousemove", this.onMove);
    this.el.removeEventListener("mouseup", this.onUp);
    this.el.removeEventListener("mouseleave", this.onLeave);
  };

  resize = () => {
    this.rect = (this.el as HTMLCanvasElement).getBoundingClientRect();
  };

  onMove = e => {
    const t = e.touches ? e.touches[0] : e;
    const touch = {
      x: t.clientX,
      y: t.clientY - Constants.navHeight,
    };

    this.mouse.x = ((touch.x + this.rect.x) / this.rect.width) * 2 - 1;
    this.mouse.y = -((touch.y + this.rect.y) / this.rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.intersectionData = intersects[0];

      this.plane.setFromNormalAndCoplanarPoint(
        this.camera.getWorldDirection(this.plane.normal),
        object.position
      );

      if (this.hovered !== object) {
        this.emit("interactive-out", { object: this.hovered });
        this.emit("interactive-over", { object });
        this.hovered = object;
      } else {
        this.emit("interactive-move", {
          object,
          intersectionData: this.intersectionData,
        });
      }
    } else {
      this.intersectionData = null;

      if (this.hovered !== null) {
        this.emit("interactive-out", { object: this.hovered });
        this.hovered = null;
      }
    }
  };

  onDown = e => {
    this.isDown = true;
    this.onMove(e);

    this.emit("interactive-down", {
      object: this.hovered,
      previous: this.selected,
      intersectionData: this.intersectionData,
    });
    this.selected = this.hovered;

    if (this.selected) {
      if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
        this.offset.copy(this.intersection).sub(this.selected.position);
      }
    }
  };

  onUp = e => {
    this.isDown = false;

    this.emit("interactive-up", { object: this.hovered });
  };

  onLeave = e => {
    this.onUp(e);

    this.emit("interactive-out", { object: this.hovered });
    this.hovered = null;
  };
}
