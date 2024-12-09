import './style.css'
import * as THREE from "three"
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

const loader = new GLTFLoader();

//camera
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.001;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 1, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = true;

//hdri
const hdriLoader = new RGBELoader();
hdriLoader.load("hdri/zwartkops_start_sunset_1k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
})

//responsive
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//Subaru Impreza
const imprezaSite = new THREE.Object3D();
imprezaSite.position.set(4, 2, -5);
scene.add(imprezaSite);

let impreza = null;
loader.load("models/Impreza/scene.gltf",
  function (gltf) {
    impreza = gltf.scene;
    imprezaSite.add(impreza);
  }
);

//Mitsubishi Lancer Evo
const lancerSite = new THREE.Object3D();
lancerSite.position.set(4, -2, -5);
scene.add(lancerSite);

let lancer = null;
loader.load("models/Lancer/scene.gltf",
  function (gltf) {
    lancer = gltf.scene;
    lancerSite.add(lancer);
  }
);

//Renault R5 Turbo
const r5Site = new THREE.Object3D();
r5Site.position.set(-4, 2, -5);
scene.add(r5Site);

let r5 = null;
loader.load("models/R5/scene.gltf",
  function (gltf) {
    r5 = gltf.scene,
      r5Site.add(r5);
  }
);

//Lancia Delta
const deltaSite = new THREE.Object3D();
deltaSite.position.set(-4, -2, -5);
scene.add(deltaSite);

let delta = null;
loader.load("models/Delta/scene.gltf",
  function (gltf) {
    delta = gltf.scene;
    deltaSite.add(delta);
  }
);

//light
const ambientLight = new THREE.AmbientLight({ color: 0xefefef });
scene.add(ambientLight);

//points
const points = [
  {
    position: new THREE.Vector3(-4, -2, -5),
    element: document.querySelector(".point-0")
  }
]

//animation
const animation = () => {

  controls.update()

  for(const point of points) {
    const screenPos = point.position.clone();
    screenPos.project(camera);
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(animation);
};

animation();
