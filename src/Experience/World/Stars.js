import * as THREE from 'three';

import Experience from '../Experience.js';
import starsVertexShader from '../shaders/stars/vertex.glsl';
import starsFragmentShader from '../shaders/stars/fragment.glsl';

export default class Stars {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setStars();
  }

  setStars() {
    this.geometry = new THREE.BufferGeometry();
    this.count = 5000;
    this.positionsArray = new Float32Array(this.count * 3);
    this.colorsArray = new Float32Array(this.count * 3);
    this.scalesArray = new Float32Array(this.count);

    const color1 = new THREE.Color(1.0, 0.75, 0.75);
    const color2 = new THREE.Color(0.75, 0.75, 1.0);

    for (let i = 0; i < this.count; i++) {
      // position
      this.positionsArray[i*3   ] = (Math.random() - 0.5) * 1000;
      this.positionsArray[i*3 +1] = (Math.random() - 0.5) * 1000;
      this.positionsArray[i*3 +2] = (Math.random() - 0.5) * 1000;

      // color
      const newColor = color1.clone();
      newColor.lerp(color2, Math.random());
      this.colorsArray[i*3   ] = newColor.r;
      this.colorsArray[i*3 +1] = newColor.g;
      this.colorsArray[i*3 +2] = newColor.b;

      // scale
      this.scalesArray[i] = Math.random() * 2 * this.sizes.pixelRatio;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positionsArray, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colorsArray, 3));
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(this.scalesArray, 1));

    this.material = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      vertexShader: starsVertexShader,
      fragmentShader: starsFragmentShader,
      uniforms: {
        uDistance: { value: 1 }
      }
    });

    this.points = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.points);
  }

  update() {
    const distance = (Math.round(this.camera.instance.position.distanceTo(new THREE.Vector3(0)) * 10) - 30) / 20;
    this.material.uniforms.uDistance.value = distance;
  }
}
