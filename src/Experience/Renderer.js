import * as THREE from 'three';
import { SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';

import Experience from "./Experience.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setRenderer();
    this.setEffects();
  }

  setRenderer() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: false
    });
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.5;
    this.instance.physicallyCorrectLights = true;
    this.instance.setClearColor('#000000');
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  setEffects() {
    this.bloomPass = new SelectiveBloomEffect(this.scene, this.camera.instance, {
      mipmapBlur: true,
      luminanceThreshold: 0.5,
      luminanceSmoothing: 0.8,
      intensity: 4.0,
      radius: 0.3
    });
    this.bloomPass.inverted = true;

    this.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.effectPass = new EffectPass(this.camera.instance, this.bloomPass);

    this.composer = new EffectComposer(this.instance);
    this.composer.setSize(this.sizes.width, this.sizes.height);

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.effectPass);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    this.composer.setSize(this.sizes.width, this.sizes.height);
  }

  update() {
    this.composer.render();
  }
}
