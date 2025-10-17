import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('app');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd9d9d9);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const frustumSize = 36;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  200
);

const cameraTarget = new THREE.Vector3(0, 5, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.6;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.enablePan = true;
controls.enableRotate = true;
controls.screenSpacePanning = false;
controls.minZoom = 0.45;
controls.maxZoom = 4;
controls.target.copy(cameraTarget);
controls.update();

const ambientLight = new THREE.HemisphereLight(0xffffff, 0xbebebe, 0.55);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
directionalLight.position.set(26, 40, 18);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
const shadowCameraSize = 40;
directionalLight.shadow.camera.near = 5;
directionalLight.shadow.camera.far = 120;
directionalLight.shadow.camera.left = -shadowCameraSize;
directionalLight.shadow.camera.right = shadowCameraSize;
directionalLight.shadow.camera.top = shadowCameraSize;
directionalLight.shadow.camera.bottom = -shadowCameraSize;
scene.add(directionalLight);

const cubeSize = 10;
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x1e6cf4,
  metalness: 0.25,
  roughness: 0.35,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.position.copy(cameraTarget);
scene.add(cube);

const wireframeMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.65,
});
const cubeWireframe = new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeometry), wireframeMaterial);
cube.add(cubeWireframe);

const groundElevation = cameraTarget.y - cubeSize / 2;

const grid = new THREE.GridHelper(160, 64, 0xa0a0a0, 0xcfcfcf);
grid.position.y = groundElevation;
grid.material.depthWrite = false;
grid.material.transparent = true;
grid.material.opacity = 0.65;
scene.add(grid);

const groundGeometry = new THREE.PlaneGeometry(220, 220);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xe4e4e4,
  roughness: 0.95,
  metalness: 0.05,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = groundElevation - 0.02;
ground.receiveShadow = true;
scene.add(ground);

const isoDistance = 38;
const isoElevation = 38;
const epsilon = 0.0001;

function createView(x, y, z, zoom = 1) {
  return {
    position: new THREE.Vector3(
      cameraTarget.x + x,
      cameraTarget.y + y,
      cameraTarget.z + z
    ),
    zoom,
  };
}

const isoViews = {
  'front-left': createView(isoDistance, isoElevation, isoDistance, 1),
  'front-right': createView(-isoDistance, isoElevation, isoDistance, 1),
  'back-left': createView(isoDistance, isoElevation, -isoDistance, 1),
  'back-right': createView(-isoDistance, isoElevation, -isoDistance, 1),
  top: createView(0, isoDistance * 1.45, epsilon, 1.45),
};

const viewButtons = document.querySelectorAll('#views button');

function setButtonState(activeView) {
  viewButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === activeView);
  });
}

function setIsometricView(viewKey) {
  const config = isoViews[viewKey];
  if (!config) {
    return;
  }

  camera.position.copy(config.position);
  camera.zoom = config.zoom ?? 1;
  camera.updateProjectionMatrix();
  camera.lookAt(cameraTarget);
  controls.target.copy(cameraTarget);
  controls.update();
  setButtonState(viewKey);
}

viewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setIsometricView(button.dataset.view);
  });
});

setIsometricView('front-left');

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const nextAspect = width / height || 1;

  renderer.setSize(width, height);

  camera.left = (-frustumSize * nextAspect) / 2;
  camera.right = (frustumSize * nextAspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.0075;

  controls.update();
  renderer.render(scene, camera);
}

animate();
