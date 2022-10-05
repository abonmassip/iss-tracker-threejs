import * as THREE from 'three';

import Experience from '../Experience.js';

export default class Earth {
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
    this.geometry = new THREE.SphereGeometry(1, 64, 64);

    // Set 00:00h GMT facing front
    this.geometry.rotateY(Math.PI * 1.5);
  }

  setTextures() {
    this.textures = {};

    this.textures.albedo = this.resources.items.earthAlbedo;
    this.textures.specular = this.resources.items.earthSpec;
    this.textures.bump = this.resources.items.earthBump;
    this.textures.albedoNight = this.resources.items.earthNightAlbedo;

    this.textures.albedo.encoding = THREE.sRGBEncoding;
    this.textures.albedoNight.encoding = THREE.sRGBEncoding;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.albedo,
      emissive: 'white',
      emissiveMap: this.textures.albedoNight,
      emissiveIntensity: 2,
      roughnessMap: this.textures.specular,
      roughness: 6.5,
      bumpMap: this.textures.bump,
      bumpScale: 0.01
    });

    this.material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace
      (
        '#include <common>',
        `#include <common>
        varying vec3 vWorldPosition;`
      );
      shader.vertexShader = shader.vertexShader.replace
      (
        '#include <fog_vertex>',
        `#include <fog_vertex>
        vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
        vWorldPosition = worldPosition.xyz;`
      );

      shader.fragmentShader = shader.fragmentShader.replace
      (
        'varying vec3 vViewPosition;',
        `varying vec3 vViewPosition;
        varying vec3 vWorldPosition;`
      );
      shader.fragmentShader = shader.fragmentShader.replace
      (
        'vec3 totalEmissiveRadiance = emissive;',
        `vec3 totalEmissiveRadiance = emissive;
        float positionZ = vWorldPosition.z;
        positionZ = max(0.0, positionZ + 0.1);
        positionZ = min(1.0, positionZ);
        totalEmissiveRadiance.r = totalEmissiveRadiance.r * positionZ;
        totalEmissiveRadiance.g = totalEmissiveRadiance.g * positionZ;
        totalEmissiveRadiance.b = totalEmissiveRadiance.b * positionZ;`
      );
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.earthGroup.add(this.mesh);
  }
}
