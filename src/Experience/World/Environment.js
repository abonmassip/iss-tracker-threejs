import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

import Experience from '../Experience.js'

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setLights();

    // Wait for resources
    this.resources.on('ready', () => {
      this.setFlare();
    })
  }

  setLights() {
    // Ambient Light
    // this.ambientLight = new THREE.AmbientLight(0x262b4a, 0.1);
    // this.scene.add(this.ambientLight);

    // Sun Light
    this.sunLight = new THREE.DirectionalLight(0xfffdf5, 1.5);
    this.sunLight.position.set(0, 0, -295);
    this.scene.add(this.sunLight);
  }

  setFlare() {
    this.textures = {};
    this.textures.flareBig = this.resources.items.lensFlare0;
    this.textures.flareSmall = this.resources.items.lensFlare3;

    this.textures.flareBig.encoding = THREE.sRGBEncoding;
    this.textures.flareSmall.encoding = THREE.sRGBEncoding;

    this.lensflare = new Lensflare();
    this.lensflare.addElement( new LensflareElement( this.textures.flareBig, 300, 0));
    this.lensflare.addElement( new LensflareElement( this.textures.flareSmall, 25, 0.4));
    this.lensflare.addElement( new LensflareElement( this.textures.flareSmall, 30, 0.45));
    this.lensflare.addElement( new LensflareElement( this.textures.flareSmall, 60, 0.6));
    this.lensflare.addElement( new LensflareElement( this.textures.flareSmall, 70, 0.7));
    this.lensflare.addElement( new LensflareElement( this.textures.flareSmall, 130, 0.84));
    this.lensflare.addElement( new LensflareElement( this.textures.flareSmall, 160, 0.88));
    this.lensflare.addElement( new LensflareElement( this.textures.flareSmall, 120, 0.9));
    this.lensflare.addElement( new LensflareElement( this.textures.flareSmall, 70, 1));
    this.sunLight.add(this.lensflare);
  }
}
