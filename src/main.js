import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const container = document.getElementById('app');
const loadingEl = document.getElementById('loading');

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// Environment for nicer lighting on metallic surfaces
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

// Lights
const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 0.6);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(10, 10, 10);
scene.add(dir);

// Load model
const loader = new GLTFLoader();
loader.load(
  '/titanic.glb',
  (gltf) => {
    const model = gltf.scene;

    // Center and scale the model to fit the view
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 10 / maxDim;
    model.scale.setScalar(scale);
    model.position.x = -center.x * scale;
    model.position.y = -center.y * scale;
    model.position.z = -center.z * scale;

    scene.add(model);

    // Frame the camera around the model
    const box2 = new THREE.Box3().setFromObject(model);
    const fitSize = box2.getSize(new THREE.Vector3());
    const fitDist = Math.max(fitSize.x, fitSize.y, fitSize.z) / (2 * Math.tan((camera.fov * Math.PI) / 360));
    camera.position.set(fitDist * 0.8, fitDist * 0.5, fitDist * 1.2);
    controls.target.set(0, 0, 0);
    controls.update();

    loadingEl.style.display = 'none';
  },
  (xhr) => {
    if (xhr.lengthComputable) {
      loadingEl.textContent = `Loading… ${Math.round((xhr.loaded / xhr.total) * 100)}%`;
    }
  },
  (err) => {
    loadingEl.textContent = 'Failed to load model';
    console.error(err);
  }
);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
