import * as THREE from 'three';

import Experience from '../Experience.js';
import { positionFromCoordinates, fetchIssCoordinates } from '../Utils/utils.js';
import TextScramble from '../Utils/TextScramble.js';

const messageText = document.querySelector('#message');
const coordinatesText = document.querySelector('#coordinatesText');
const latitudeText = document.querySelector('#latitude');
const longitudeText = document.querySelector('#longitude');
const antennaIcon = document.querySelector('#antennaIcon');
const issText = document.querySelector('#iss');

export default class Iss {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.earthGroup = this.experience.world.earthGroup;
    this.earth = this.experience.world.earth;
    this.issGroup = new THREE.Group();
    this.camera = this.experience.camera
    this.sizes = this.experience.sizes;

    this.debug = this.experience.debug;
    this.cameraDebugFolder = this.experience.camera.debugFolder;

    this.resources = this.experience.resources;
    this.resource = this.resources.items.issModelLow;

    this.located = false;

    this.latitude = 0;
    this.longitude = 0;
    this.radius = 0;

    this.issTrail = [];
    this.trailGeometry = new THREE.BoxGeometry(0.0025, 0.0025, 0.0025);
    this.trailMaterial = new THREE.MeshBasicMaterial();

    this.raycaster = new THREE.Raycaster();

    this.setIss();
    // this.startApi();

    // Debug
    this.debugObject = {
      apiTest: async () => this.getCoordinates(),
      stopApiCall: () => {
        clearInterval(this.fetchInterval);
        console.log('API calls stopped');
      },
      startApiCall: () => {
        this.fetchInterval = setInterval(() => this.getCoordinates(), 5000);
        this.getCoordinates();
        console.log('API calls started');
      },
      focusIss: () => {
        this.locateIss();
      }
    }

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('---- ISS Location API ----');
      this.debugFolder.close();

      this.debugFolder.add(this.debugObject, 'stopApiCall').name('Stop API calls');
      this.debugFolder.add(this.debugObject, 'startApiCall').name('Start API calls');
      this.debugFolder.add(this.debugObject, 'apiTest').name('Test API');
      this.cameraDebugFolder.add(this.debugObject, 'focusIss').name('Focus ISS');
    }
  }

  setIss() {
    this.model = this.resource.scene.children[0];
    this.model.material = new THREE.MeshStandardMaterial({
      color: 'white',
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xcccccc,
      emissiveIntensity: 0.1,
    });
    this.model.scale.set(0.0005, 0.0005, 0.0005);
    this.issGroup.add(this.model);

    this.issLight = new THREE.PointLight(0xffffcc, 0.1, 0.1, 2);
    this.issLight.position.set(0, 0.02, -0.01);

    this.issGroup.add(this.issLight);
  }

  startApi() {
    this.fetchInterval = setInterval(() => this.getCoordinates(), 5000);
    this.getCoordinates();
  }

  getCoordinates() {
    antennaIcon.classList.add('loading');
    setTimeout(() => antennaIcon.classList.remove('loading'), 2000);

    setTimeout(async () => {
      try {
        const data = await fetchIssCoordinates();
        const lat = parseFloat(data.iss_position.latitude);
        const lon = parseFloat(data.iss_position.longitude);

        this.moveIss(lat, lon);
      } catch (error) {
        clearInterval(this.fetchInterval);
      }
    }, 1000);
  }

  moveIss(lat, lon) {
    this.latitude = lat;
    this.longitude = lon;
    this.radius = 1.1;

    const coordinates = positionFromCoordinates(this.latitude, this.longitude, this.radius);
    this.issGroup.position.set(coordinates.x, coordinates.y, coordinates.z);
    this.issGroup.lookAt(0,0,0);

    this.addTrail({x: coordinates.x, y: coordinates.y, z: coordinates.z});

    this.updateText();

    if (!this.located) {
      this.earthGroup.add(this.issGroup);
      this.locateIss();
    }
  }

  addTrail(location) {
    if(this.issTrail.length > 5) {
      this.earthGroup.add(this.issTrail[0]);
      this.issTrail.shift();
    }

    const trail = new THREE.Mesh(this.trailGeometry, this.trailMaterial);
    trail.position.set(location.x, location.y, location.z);

    this.issTrail.push(trail);
  }

  locateIss() {
    if(this.issGroup.position.distanceTo(new THREE.Vector3(0)) > 0) {
      const issWorldPosition = this.issGroup.getWorldPosition(new THREE.Vector3(0));

      this.experience.camera.focusIss(issWorldPosition.x, issWorldPosition.y, issWorldPosition.z);

      this.located = true;
    }
  }

  updateText() {
    messageText.textContent = 'ISS last known position:';
    coordinatesText.style.display = 'inline';

    const latitudeFx = new TextScramble(latitudeText);
    latitudeFx.setText(this.latitude.toString());

    const longitudeFx = new TextScramble(longitudeText);
    longitudeFx.setText(this.longitude.toString());
  }

  update() {
    const screenPosition = this.issGroup.getWorldPosition(new THREE.Vector3(0)).clone();
    screenPosition.project(this.camera.instance);

    this.raycaster.setFromCamera(screenPosition, this.camera.instance);
    const intersects = this.raycaster.intersectObject(this.earth.mesh, true);

    if (intersects.length === 0) {
        issText.classList.add('visible');
    } else {
      const intersectionDistance = intersects[0].distance;
      const pointDistance = this.issGroup.getWorldPosition(new THREE.Vector3(0)).distanceTo(this.camera.instance.position);

      if (intersectionDistance < pointDistance) {
        issText.classList.remove('visible');
      } else {
        issText.classList.add('visible');
      }
    }

    const translateX = screenPosition.x * this.sizes.width * 0.5;
    const translateY = - screenPosition.y * this.sizes.height * 0.5;
    const zoom = 10 - Math.round((screenPosition.z - 0.778) * (1 - 0) / (0.968 - 0.778) * 10);
    issText.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    issText.firstChild.style.top = `${-40 - zoom * 4}px`;
    issText.firstChild.style.left = `${10 + zoom * 3}px`;
    issText.firstChild.style.fontSize = `${zoom > 5 ? '30' : '20'}px`;
  }
}
