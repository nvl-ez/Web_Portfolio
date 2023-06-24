import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();

const FOV = 75;
const ASPECT_RATIO = window.innerWidth/window.innerHeight;
const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, 0.1, 1000); //Ultimos dos valores near clip and further clip

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

scene.add(pointLight);

function animate(){ 
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();