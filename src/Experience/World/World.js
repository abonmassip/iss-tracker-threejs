import * as THREE from 'three';

import Experience from '../Experience.js';
import Environment from './Environment.js';
import Stars from './Stars.js';
import Earth from './Earth.js';
import Clouds from './Clouds.js';
import Atmosphere from './Atmosphere.js';
import Sun from './Sun.js';
import Iss from './Iss.js';

import { degreesToRadians } from '../Utils/utils.js';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.environment = new Environment();
    this.stars = new Stars();
    this.earthGroup = new THREE.Group();
    this.obliquityGroup = new THREE.Group();
    this.obliquityGroup.add(this.earthGroup);
    this.scene.add(this.obliquityGroup);
    this.debug = this.experience.debug;
    this.axesHelper = new THREE.AxesHelper(2);

    this.debugObject = {
      obliquity: true,
      axesHelper: false,
      earthVisible: true,
      cloudsVisible: true,
      atmosphereVisible: true
    };

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('---- Earth ----');
      this.debugFolder.close();

      this.debugFolder.add(this.debugObject, 'obliquity').name('Obliquity ( Axial Tilt ) ').onChange(() => {
        this.obliquityGroup.rotation.z = this.debugObject.obliquity ? degreesToRadians(23.4) : 0;
      });

      this.debugFolder.add(this.debugObject, 'axesHelper').name('Axes Helper').onChange(() => {
        if (this.debugObject.axesHelper) {
          this.earthGroup.add(this.axesHelper);
        } else {
          this.axesHelper.removeFromParent();
        }
      })

      this.debugFolder.add(this.debugObject, 'earthVisible').name('Earth visibility').onChange(() => {
        !this.debugObject.earthVisible ? this.earth.mesh.removeFromParent() : this.earthGroup.add(this.earth.mesh);
      });

      this.debugFolder.add(this.debugObject, 'cloudsVisible').name('Clouds visibility').onChange(() => {
        !this.debugObject.cloudsVisible ? this.clouds.mesh.removeFromParent() : this.earthGroup.add(this.clouds.mesh);
      });

      this.debugFolder.add(this.debugObject, 'atmosphereVisible').name('Atmosphere visibility').onChange(() => {
        !this.debugObject.atmosphereVisible ? this.atmosphere.mesh.removeFromParent() : this.scene.add(this.atmosphere.mesh);
      });
    }

    // Wait for resources
    this.resources.on('ready', () => {
      // Setup
      this.earth = new Earth();
      this.clouds = new Clouds();
      this.atmosphere = new Atmosphere();
      this.sun = new Sun();
      this.iss = new Iss();
    })

    this.setObliquity();
  }

  setObliquity() {
    // Earth Obliquity 23.4º
    this.obliquityGroup.rotation.z = degreesToRadians(23.4);
  }

  rotate() {
    const millisecondsInADay = 86400000;
    const anglePerMillisecond = degreesToRadians(360 / millisecondsInADay);

    this.earthGroup.rotation.y = (this.experience.time.current) * anglePerMillisecond;
  }

  update() {
    this.rotate();
    this.stars.update();

    if (this.iss) {
      this.iss.update();
    }

    if (this.atmosphere) {
      this.atmosphere.update();
    }
  }
}
