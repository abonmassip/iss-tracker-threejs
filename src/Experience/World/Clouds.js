import * as THREE from 'three';

import Experience from '../Experience.js';

export default class Clouds {
  constructor() {
    this.experience = new Experience();
    this.earthGroup = this.experience.world.earthGroup;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(1.0075, 64, 64);

    // Set 00:00h GMT facing front
    this.geometry.rotateY(Math.PI * 1.5);
  }

  setTextures() {
    this.textures = {};

    this.textures.albedo = this.resources.items.cloudsAlbedo;
    this.textures.alpha = this.resources.items.cloudsAlpha;

    this.textures.albedo.encoding = THREE.sRGBEncoding;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.albedo,
      bumpMap: this.textures.albedo,
      bumpScale: -0.003,
      transparent: true,
      opacity: 0.8,
      alphaMap: this.textures.alpha,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.earthGroup.add(this.mesh);
  }
}
