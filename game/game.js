// game/game.js - minimal three.js scene
import * as THREE from 'https://unpkg.com/three@0.154.0/build/three.module.js';

let renderer, scene, camera, animId;

export function setLoadingProgress(pct) {
  const el = document.getElementById('progress');
  if (el) el.innerText = pct + '%';
}

export function startGame() {
  const canvas = document.getElementById('gameCanvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 3);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(hemi);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(20,20), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  ground.rotation.x = -Math.PI/2;
  ground.receiveShadow = true;
  scene.add(ground);

  const geo = new THREE.SphereGeometry(0.3, 24, 24);
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ff66 });
  const sphere = new THREE.Mesh(geo, mat);
  sphere.position.y = 1;
  scene.add(sphere);

  function animate() {
    animId = requestAnimationFrame(animate);
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
