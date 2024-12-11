import './style.css'
import * as THREE from "three"
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js'
import gsap from 'gsap';

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

//hdri
const hdriLoader = new RGBELoader();
hdriLoader.load("hdri/zwartkops_start_sunset_4k.hdr", (texture) => {
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

//clickListener
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const points = document.querySelectorAll(".point");
const itemButtons = document.querySelectorAll(".shop");
const returnButton = document.querySelector(".return");
const addToCartButton = document.querySelector(".addToCart");

let clickedCar = null;
let rotateAnim = null;
window.addEventListener('click',
  (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      clickedCar = intersects[0].object;

      gsap.to(camera.position, { duration: 1, x: clickedCar.parent.parent.parent.position.x, y: clickedCar.parent.parent.parent.position.y, z: 2 })
      rotateAnim = gsap.to(clickedCar.parent.parent.parent.rotation, { duration: 15, y: clickedCar.rotation.y + Math.PI * 2});
      rotateAnim.repeat(-1);
      camera.lookAt(clickedCar.position);

      let i = 0;
      for (i; i < points.length; i++) {
        points[i].classList.remove("visible");
        itemButtons[i].classList.add("visible");
      }

    }
  });

returnButton.addEventListener("click",
  (event) => {
    gsap.to(camera.position, { x: 0, y: 1, z: 5, duration: 1 });
    window.setTimeout(() => {
      camera.lookAt(0, 0, 0);
    }, 1000);

    rotateAnim.repeat(0);

    let i = 0;
      for (i; i < points.length; i++) {
        points[i].classList.add("visible");
        itemButtons[i].classList.remove("visible");
      }
  }
)

addToCartButton.addEventListener("click",
  (event) => {
    console.log("Added to cart");
  }
)

//animation
const animation = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(animation);
};

animation();
