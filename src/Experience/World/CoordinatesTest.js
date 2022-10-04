import * as THREE from 'three';

import Experience from '../Experience.js';
import { positionFromCoordinates } from '../Utils/utils.js';

export default class CoordinatesTest {
  constructor() {
    this.experience = new Experience();
    this.earthGroup = this.experience.world.earthGroup;
    this.debug = this.experience.debug;

    this.enabled = false;

    this.latitude = 0;
    this.longitude = 0;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('---- Coordinates Test ----');
      this.debugFolder.close();

      this.debugFolder.add(this, 'enabled').name('DISPLAY TEST').onChange(() => {
        if (this.enabled) {
          this.earthGroup.add(this.mesh);
        } else {
          this.mesh.removeFromParent();
        }
      })

      this.debugLat = this.debugFolder.add(this, 'latitude').min(-90).max(90).step(0.001).onChange(() => this.moveTest());

      this.debugLon = this.debugFolder.add(this, 'longitude').min(-180).max(180).step(0.001).onChange(() => this.moveTest());

      this.debugObject = {
        goToLA : () => this.moveTest(34.052235, -118.243683),
        goToZurich : () => this.moveTest(47.3744489, 8.5410422),
        goToBCN : () => this.moveTest(41.382681, 2.177024),
        reset : () => this.moveTest(0, 0),
      };

      this.debugFolder.add(this.debugObject, 'goToLA').name('Los Angeles');
      this.debugFolder.add(this.debugObject, 'goToZurich').name('Zurich');
      this.debugFolder.add(this.debugObject, 'goToBCN').name('Barcelona');
      this.debugFolder.add(this.debugObject, 'reset').name('reset');
    }

    this.setTest();
    this.moveTest();
  }

  setTest() {
    this.geometry =  new THREE.SphereGeometry(0.03, 10, 10);
    this.material = new THREE.MeshBasicMaterial({ color: 'yellow'});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  moveTest(lat = this.latitude, lon = this.longitude) {
    this.latitude = lat;
    this.longitude = lon;

    if (this.debug.active) {
      this.debugLat.updateDisplay();
      this.debugLon.updateDisplay();
    }

    const coordinates = positionFromCoordinates(lat, lon, 1.01);
    this.mesh.position.set(coordinates.x, coordinates.y, coordinates.z);
  }
}

