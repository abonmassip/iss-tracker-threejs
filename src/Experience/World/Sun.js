import * as THREE from 'three';

import Experience from '../Experience.js';

export default class Sun {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setSun();
  }

  setSun() {
    this.geometry = new THREE.SphereGeometry(2, 16, 16);

    this.material = new THREE.MeshStandardMaterial({
      emissive: 'white',
      emissiveIntensity: 100
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.z = - 300;
    this.scene.add(this.mesh);
  }
}
