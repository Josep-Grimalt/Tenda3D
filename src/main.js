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

//models click listener
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const itemButtons = document.querySelectorAll(".shop");
const price = document.querySelector(".price .label");
const description = document.querySelector(".description .text");

let rotateAnim = null;
let clicked = false;
let lastClickedCar = null;
window.addEventListener('click',
  (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0 && !clicked) {
      const clickedCar = intersects[0].object;
      clicked = true;

      //animates the car model to get every angle out of it
      if (lastClickedCar != clickedCar) {
        rotateAnim = gsap.to(clickedCar.parent.parent.parent.rotation, { duration: 15, y: clickedCar.rotation.y + Math.PI * 2, repeat: -1 });
        lastClickedCar = clickedCar;
      } else {
        rotateAnim.repeat(-1);
        rotateAnim.restart();
      }

      //moves camera to a position where the clicked car is in fornt of it
      gsap.to(camera.position, { duration: 1, x: clickedCar.parent.parent.parent.position.x, y: clickedCar.parent.parent.parent.position.y, z: 2 })
      camera.lookAt(clickedCar.position);

      //adds visibility to shop buttons
      let i = 0;
      for (i; i < itemButtons.length; i++) {
        itemButtons[i].classList.add("visible");
      }

      //modifies the details & price tags
      switch (clickedCar.name) {
        case "Renault_R5_Default_OBJ030_0002":
          price.textContent = "149 €";
          description.textContent = "The group B icon. Can you tame the inline-4 RWD 185 HP beast it hides?";
          break;
        case "Subaru_Impreza_Default_OBJ042_0002":
          price.textContent = "199 €";
          description.textContent = "One of the most condecorated models of all time." +
            "Experiene the powerfull boxer 4-cylinder with 310 HP AWD";
          break;
        case "Lancia_Delta_Default_OBJ057_0002":
          price.textContent = "189 €";
          description.textContent = "The car with the most official wins in rally races." +
            "With its AWD 215 HP inline-4 motor, you will see why it won 6 back-to-back championships";
          break;
        case "body_geo_Default_OBJ068_0002":
          price.textContent = "174 €";
          description.textContent = "The jack of all trades. Try this all terrain master with a inline-4 400 HP AWD";
          break;
      }
    }
  });

//return button click listener
const returnButton = document.querySelector(".return");

returnButton.addEventListener("click",
  () => {
    gsap.to(camera.position, { x: 0, y: 1, z: 5, duration: 1 });
    window.setTimeout(() => {
      camera.lookAt(0, 0, 0);
    }, 1000);

    rotateAnim.repeat(0);
    clicked = false

    let i = 0;
    for (i; i < itemButtons.length; i++) {
      itemButtons[i].classList.remove("visible");
    }
  }
)

//add to cart button click listener
const addToCartButton = document.querySelector(".addToCart");

addToCartButton.addEventListener("click",
  () => {
    console.log("Added to cart");
  }
)

//car name hover
const carModelDisplay = document.querySelector(".car");

window.addEventListener("mousemove",
  (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      const hoveredCar = intersects[0].object;

      carModelDisplay.style.opacity = 1;
      carModelDisplay.style.left = `${event.clientX + 10}px`;
      carModelDisplay.style.top = `${event.clientY + 10}px`;

      switch (hoveredCar.name) {
        case "Renault_R5_Default_OBJ030_0002":
          carModelDisplay.textContent = "Renault R5 Turbo";
          break;
        case "Subaru_Impreza_Default_OBJ042_0002":
          carModelDisplay.textContent = "Subaru Impreza WRX STI";
          break;
        case "Lancia_Delta_Default_OBJ057_0002":
          carModelDisplay.textContent = "Lancia Delta Integrale";
          break;
        case "body_geo_Default_OBJ068_0002":
          carModelDisplay.textContent = "Mitsubishi Lancer Evo VII";
          break;
      }
    } else {
      carModelDisplay.style.opacity = 0;
    }
  }
)

//animation
const animation = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(animation);
};

animation();
