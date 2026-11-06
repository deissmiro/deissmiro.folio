import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const stage = document.getElementById('stage');
const meAva = document.getElementById('meAva');
const loadingEl = stage.querySelector('.loading');

// load the model file
const bytes = new Uint8Array(await (await fetch('assets/model.glb')).arrayBuffer());

const makeScene = () => {
  const sc = new THREE.Scene();
  sc.add(new THREE.HemisphereLight(0xffffff, 0xd8d6d0, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(1.6, 3, 2.6); sc.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2); rim.position.set(-2, 2, -2); sc.add(rim);
  return sc;
};
const makeRenderer = (el) => {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  r.setClearColor(0x000000, 0);
  el.appendChild(r.domElement);
  return r;
};

// each canvas gets its own renderer, scene and copy of the model
const big = { el: stage, renderer: makeRenderer(stage), scene: makeScene(), cam: new THREE.PerspectiveCamera(20, 170 / 308, .1, 50), w: 0, h: 0 };
const small = { el: meAva, renderer: makeRenderer(meAva), scene: makeScene(), cam: new THREE.PerspectiveCamera(26, 1, .05, 10) };
small.renderer.setSize(40, 40, false);

const fitBig = () => {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return false;
  big.w = w; big.h = h;
  big.renderer.setSize(w, h, false);
  big.cam.aspect = w / h;
  const half = 1.86 / .9 / 2;
  big.cam.position.set(0, .93, half / Math.tan(THREE.MathUtils.degToRad(big.cam.fov / 2)));
  big.cam.lookAt(0, .93, 0); big.cam.updateProjectionMatrix();
  return true;
};
fitBig();

let headY = 1.65;
const loader = new GLTFLoader();
const load = (inst) => new Promise((res, rej) => loader.parse(bytes.buffer.slice(0), '', (gltf) => {
  inst.model = gltf.scene;
  inst.model.traverse(o => { if (o.isMesh) o.frustumCulled = false; });
  inst.scene.add(inst.model);
  inst.bones = {};
  ['Spine2', 'Neck', 'Head'].forEach(n => inst.bones[n] = inst.model.getObjectByName(n));
  if (gltf.animations.length) { inst.mixer = new THREE.AnimationMixer(inst.model); inst.mixer.clipAction(gltf.animations[0]).play(); }
  inst.model.updateMatrixWorld(true);
  res(inst);
}, rej));

Promise.all([load(big), load(small)]).then(() => {
  if (big.bones.Head) headY = big.bones.Head.getWorldPosition(new THREE.Vector3()).y;
  small.cam.position.set(0, headY + .06, .62); small.cam.lookAt(0, headY + .05, 0);
  stage.classList.add('ready');
}).catch((err) => { loadingEl.textContent = 'model failed to load'; console.error(err); });

// drag to spin the avatar
let spin = 0, spinVel = 0, dragging = false, lastX = 0;
stage.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; stage.setPointerCapture(e.pointerId); });
stage.addEventListener('pointermove', e => { if (!dragging) return; spinVel = (e.clientX - lastX) * .012; spin += spinVel; lastX = e.clientX; });
const endDrag = () => dragging = false;
stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag);

const _pq = new THREE.Quaternion(), _off = new THREE.Quaternion(), _e = new THREE.Euler(), _inv = new THREE.Quaternion();
function aim(bone, yaw, pitch) {
  if (!bone || !bone.parent) return;
  bone.parent.getWorldQuaternion(_pq);
  _off.setFromEuler(_e.set(pitch, yaw, 0, 'YXZ'));
  // convert a world-space rotation into the bone's local space
  _inv.copy(_pq).invert().multiply(_off).multiply(_pq);
  bone.quaternion.premultiply(_inv);
  bone.updateMatrixWorld(true);
}
function pose(inst, dt, yaw, pitch, body) {
  if (!inst.model) return;
  inst.mixer && inst.mixer.update(dt);
  inst.model.rotation.y = body;
  inst.model.updateMatrixWorld(true);
  aim(inst.bones.Spine2, yaw * .18, pitch * .12);
  aim(inst.bones.Neck,   yaw * .32, pitch * .35);
  aim(inst.bones.Head,   yaw * .42, pitch * .5);
}

const clock = new THREE.Clock();
const look = { yaw: 0, pitch: 0, body: 0 };
const v = new THREE.Vector3();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  const sw = stage.clientWidth, sh = stage.clientHeight;
  const bigVisible = sw > 0 && sh > 0;
  if (bigVisible && (sw !== big.w || sh !== big.h)) fitBig();

  // where is the cursor relative to the avatar's head on screen?
  const p = window.__pointer || { x: innerWidth / 2, y: innerHeight / 2, t: 0 };
  let hx, hy;
  if (bigVisible) {
    const r = stage.getBoundingClientRect();
    v.set(0, headY, 0).project(big.cam);
    hx = r.left + (v.x + 1) / 2 * r.width; hy = r.top + (1 - v.y) / 2 * r.height;
  } else {
    const r = meAva.getBoundingClientRect();
    hx = r.left + r.width / 2; hy = r.top + r.height / 2;
  }
  let nx = THREE.MathUtils.clamp((p.x - hx) / (innerWidth * .45), -1, 1);
  let ny = THREE.MathUtils.clamp((p.y - hy) / (innerHeight * .55), -1, 1);
  if (p.t === 0 || performance.now() - p.t > 4000) { nx = Math.sin(t * .4) * .5; ny = Math.sin(t * .27) * .15; }
  look.yaw += (nx * .95 - look.yaw) * .08;
  look.pitch += (ny * .5 - look.pitch) * .08;
  look.body += (nx * .32 - look.body) * .04;
  if (!dragging) { spinVel *= .92; spin += spinVel; spin += (0 - spin) * .03; }

  try {
    if (bigVisible && big.model) { pose(big, dt, look.yaw, look.pitch, look.body + spin); big.renderer.render(big.scene, big.cam); }
    if (small.model) { pose(small, dt, look.yaw, look.pitch, look.body); small.renderer.render(small.scene, small.cam); }
  } catch (err) { console.error(err); }
}
requestAnimationFrame(frame);
