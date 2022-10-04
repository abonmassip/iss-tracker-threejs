import * as THREE from 'three';

import Experience from '../Experience.js';

import atmosphereVertexShader from '../shaders/atmosphere/vertex.glsl';
import atmosphereFragmentShader from '../shaders/atmosphere/fragment.glsl';
import { Vector3 } from 'three';

export default class Atmosphere {
  constructor() {
    this.experience = new Experience();
    this.bloomPass = this.experience.renderer.bloomPass;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera.instance;
    this.debug = this.experience.debug;
    this.debugFolder = this.experience.world.debugFolder;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(1.015, 64, 64);

    const count = this.geometry.attributes.normal.array.length;
    const normals = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      normals[i] = this.geometry.attributes.normal.array[i];
    }

    this.geometry.setAttribute('aNormals', new THREE.BufferAttribute(normals, 3));

  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      transparent: true,
      toneMapped: false,
      uniforms: {
        uColor: { value: { r: 157 / 255, g: 223 / 255, b: 255 / 255 } },
        uCameraPosition: { value: new THREE.Vector3(1, 0, 0) },
        viewVector: { value: new Vector3(0) }
      }
    });

    //DEBUG
    if (this.debug.active) {
      this.debugFolder
        .addColor(this.material.uniforms.uColor, 'value')
        .name('Atmosphere color');
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.uCameraPosition.value.x = (this.camera.position.x).toFixed(2);
    this.material.uniforms.uCameraPosition.value.y = (this.camera.position.y).toFixed(2);
    this.material.uniforms.uCameraPosition.value.z = (this.camera.position.z).toFixed(2);

    let viewVector = new THREE.Vector3().subVectors( this.camera.position, this.mesh.getWorldPosition(new THREE.Vector3(0)));
    this.material.uniforms.viewVector.value = viewVector;
  }
}
