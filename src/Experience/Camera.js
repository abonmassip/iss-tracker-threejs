import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

import Experience from './Experience.js'

export default class Camera {
  constructor() {
    // Setup
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('---- Camera ----');
      this.debugFolder.close();
    }

    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 500);
    this.instance.position.set(0, 0, -6);
    this.scene.add(this.instance);

    // Debug
    if(this.debug.active) {
      const moveCamera = (x, y, z) => {
        gsap.to(this.instance.position, { duration: 2, delay: 0, keyframes: {
          x: [this.instance.position.x, this.instance.position.x + 1, x],
          y: [this.instance.position.y, this.instance.position.y + 3, y],
          z: [this.instance.position.z, z]
        }});
      }
      const debugObject = {
        frontCamera: () => {
          if (this.instance.position.z < 2.5) {
            moveCamera(0, 0, 5);
          }
        },
        backCamera: () => {
          if (this.instance.position.z > -2.5) {
            moveCamera(0, 0, -5);
          }
        }
      }

      this.debugFolder.add(debugObject, 'frontCamera').name('Night view');
      this.debugFolder.add(debugObject, 'backCamera').name('Day view');
    }
  }

  focusIss(x, y, z) {
    gsap.to(this.instance.position, { duration: 3, delay: 0, x: x, y: y, z: z });
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = -0.1;
    this.controls.enablePan = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 6;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
