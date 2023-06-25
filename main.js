import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from "@tweenjs/tween.js";

const debug = true;
const top = 100;
const earthRadius = 10;
const moonRadius = earthRadius/4;

//ESCENA
const scene = new THREE.Scene();

//CAMARA
const FOV = 75;
const ASPECT_RATIO = window.innerWidth/window.innerHeight;
const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, 0.1, 1000); //Ultimos dos valores near clip and further clip
camera.position.setZ(30);

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

//LUZ Universal
const pointLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(100, 100, 20);

scene.add(pointLight);

///////////////
// ELEMENTOS //
///////////////

//TIERRA
const earthTexture = new THREE.TextureLoader().load('earth-map.jpg');
const earthNormalTexture = new THREE.TextureLoader().load('earth-normal-map.jpg');
const earthSpecularTexture = new THREE.TextureLoader().load('earthSpecularMap.jpg');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(earthRadius, 50, 50),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormalTexture,
    specularMap: earthSpecularTexture
  })
);

scene.add(earth);

//LUNA
const moonTexture = new THREE.TextureLoader().load('moon-map.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(moonRadius, 25, 25),
  new THREE.MeshStandardMaterial({
    map: moonTexture
  })
);
moon.x = 50;
scene.add(moon);

//DEBUG
//OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
if(debug){
  //Helpers
  const plainHelper = new THREE.GridHelper(200, 50);

  scene.add(plainHelper);
}

//FUNCIONES
function animate(){
  requestAnimationFrame(animate);

  TWEEN.update();

  renderer.render(scene, camera);
}

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y+top, z);

  scene.add(star);

  return star;
}

function moveElements(){
  moon.rotation.x += 0.1;
}

//////////
// CODE //
//////////
//Evento de scroll ejecuta funcion
document.body.onscroll=moveElements;

//Estrellas
Array(200).fill().forEach(addStar);

//Movemos la luna arriba
moon.position.setY(top);
moon.rotation.y = 90;

//Movemos la camara arriba de la luna
camera.position.setZ(-40);
camera.position.setX(0);
camera.position.setY(top);
camera.lookAt(0, top, moonRadius);
// Set the target position and duration for the animation
const targetPosition = new THREE.Vector3(0, top+moonRadius, -moonRadius/2); 
const duration = 2000; // Example: Animation duration in milliseconds

// Create a new tween for the camera's position
const cameraTween = new TWEEN.Tween(camera.position)
  .to(targetPosition, duration)
  .easing(TWEEN.Easing.Quadratic.InOut) // Example: Easing function
  .start();

animate();