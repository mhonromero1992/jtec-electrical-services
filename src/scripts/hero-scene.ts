// The hero diorama: a Luzon house with a red corrugated roof, a rooftop array, a wall-mounted hybrid
// inverter and battery, on a plinth of rice paddies. The time of day drives the sun, the light,
// the battery gauge and the window lights. Renders on demand only.
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  RepeatWrapping,
  Scene,
  Shape,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export interface SceneState {
  time: number; // hours, 5..21
  production: number; // 0..1
  battery: number; // 0..1
  night: number; // 0..1
  sky: string; // css colour for the hero field
}

export interface HeroScene {
  setTime(hours: number): SceneState;
  setPointer(x: number, y: number): void;
  setScroll(progress: number): void;
  setActive(active: boolean): void;
  resize(): void;
  dispose(): void;
}

const SUNRISE = 5.75;
const SUNSET = 18.0;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function interpolateStops(stops: [number, number][], t: number) {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [t1, v1] = stops[i];
    const [t0, v0] = stops[i - 1];
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return stops[stops.length - 1][1];
}

function interpolateColour(stops: [number, string][], t: number, out: Color) {
  const a = new Color();
  const b = new Color();
  if (t <= stops[0][0]) return out.set(stops[0][1]);
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const k = (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]);
      a.set(stops[i - 1][1]);
      b.set(stops[i][1]);
      return out.copy(a).lerp(b, k);
    }
  }
  return out.set(stops[stops.length - 1][1]);
}

// Hero field colours by hour: always dark enough for the light headline.
const SKY_STOPS: [number, string][] = [
  [5.0, '#021a31'],
  [5.75, '#08294a'],
  [7.0, '#0a3761'],
  [12.0, '#0b4677'],
  [16.5, '#0a3d69'],
  [18.0, '#10294b'],
  [19.2, '#041d37'],
  [21.0, '#021a31'],
];

const BATTERY_STOPS: [number, number][] = [
  [5.0, 0.42],
  [6.5, 0.38],
  [9.0, 0.56],
  [12.0, 0.84],
  [14.5, 1.0],
  [18.0, 1.0],
  [21.0, 0.7],
];

// ------------------------------------------------------------------ textures
function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  draw(ctx);
  const tex = new CanvasTexture(c);
  if (srgb) tex.colorSpace = SRGBColorSpace;
  return tex;
}

function seeded(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function paddyTexture() {
  return canvasTexture(1024, 768, (ctx) => {
    const rand = seeded(11);
    ctx.fillStyle = '#b8ad7c';
    ctx.fillRect(0, 0, 1024, 768);
    const greens = ['#7aa257', '#86ad5d', '#71994f', '#90b664', '#6b964d', '#7fa95b'];
    const cols = [0, 150, 300, 470, 640, 800, 1024];
    const rows = [0, 140, 300, 470, 620, 768];
    for (let r = 0; r < rows.length - 1; r++) {
      for (let c = 0; c < cols.length - 1; c++) {
        const x = cols[c] + 7;
        const y = rows[r] + 7;
        const w = cols[c + 1] - cols[c] - 14;
        const h = rows[r + 1] - rows[r] - 14;
        ctx.fillStyle = greens[Math.floor(rand() * greens.length)];
        ctx.fillRect(x, y, w, h);
        // planted rows
        ctx.strokeStyle = 'rgba(40,70,30,0.16)';
        ctx.lineWidth = 2;
        for (let k = x + 6; k < x + w; k += 9) {
          ctx.beginPath();
          ctx.moveTo(k, y + 3);
          ctx.lineTo(k, y + h - 3);
          ctx.stroke();
        }
      }
    }
    // the house lot and its path, in concrete
    ctx.fillStyle = '#cfcabb';
    ctx.fillRect(176, 196, 520, 380);
    ctx.fillStyle = '#d8d2c1';
    ctx.fillRect(560, 560, 70, 208);
  });
}

function cellTexture() {
  return canvasTexture(640, 512, (ctx) => {
    const W = 640;
    const H = 512;
    ctx.fillStyle = '#c9ced6';
    ctx.fillRect(0, 0, W, H);
    const pad = 10;
    const cols = 12;
    const rows = 6;
    const gap = 3;
    const cw = (W - pad * 2 - gap * (cols - 1)) / cols;
    const ch = (H - pad * 2 - gap * (rows - 1)) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = pad + c * (cw + gap);
        const y = pad + r * (ch + gap);
        const g = ctx.createLinearGradient(x, y, x + cw, y + ch);
        g.addColorStop(0, '#16284a');
        g.addColorStop(1, '#0c1a33');
        ctx.fillStyle = g;
        ctx.fillRect(x, y, cw, ch);
        ctx.fillStyle = 'rgba(160,175,200,0.35)';
        for (let b = 1; b <= 3; b++) ctx.fillRect(x + (cw * b) / 4 - 0.6, y, 1.2, ch);
      }
    }
    // half-cut split line across the middle of the module
    ctx.fillStyle = '#9aa6b6';
    ctx.fillRect(pad, H / 2 - 2, W - pad * 2, 4);
  });
}

function corrugationNormal() {
  // a sine profile across u, encoded as a tangent-space normal map
  const tex = canvasTexture(
    128,
    4,
    (ctx) => {
      const img = ctx.createImageData(128, 4);
      for (let x = 0; x < 128; x++) {
        const slope = Math.cos((x / 128) * Math.PI * 2) * 0.85;
        const nx = -slope;
        const nz = 1;
        const len = Math.hypot(nx, nz);
        const r = Math.round(((nx / len) * 0.5 + 0.5) * 255);
        const b = Math.round(((nz / len) * 0.5 + 0.5) * 255);
        for (let y = 0; y < 4; y++) {
          const i = (y * 128 + x) * 4;
          img.data[i] = r;
          img.data[i + 1] = 128;
          img.data[i + 2] = b;
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    },
    false,
  );
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

function glowTexture() {
  return canvasTexture(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,214,120,1)');
    g.addColorStop(0.18, 'rgba(255,190,70,0.75)');
    g.addColorStop(0.45, 'rgba(255,170,40,0.22)');
    g.addColorStop(1, 'rgba(255,160,30,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  });
}

// ------------------------------------------------------------------ the scene
export function createHeroScene(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean; mobile: boolean }): HeroScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.5 : 1.75));

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.55;

  const disposables: { dispose(): void }[] = [pmrem, envTexture];
  const track = <T extends { dispose(): void }>(d: T) => {
    disposables.push(d);
    return d;
  };
  const shadowed = (m: Mesh, cast = true, receive = true) => {
    m.castShadow = cast;
    m.receiveShadow = receive;
    return m;
  };
  const std = (color: string, roughness = 0.8, metalness = 0) =>
    track(new MeshStandardMaterial({ color, roughness, metalness }));

  const world = new Group();
  scene.add(world);

  // --- plinth and paddies
  const plinth = shadowed(
    new Mesh(track(new RoundedBoxGeometry(16, 0.9, 12, 3, 0.18)), std('#0b3a63', 0.9)),
    false,
    true,
  );
  plinth.position.y = -0.45;
  world.add(plinth);

  const paddyTex = track(paddyTexture());
  paddyTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const ground = shadowed(
    new Mesh(track(new PlaneGeometry(15.6, 11.6)), track(new MeshStandardMaterial({ map: paddyTex, roughness: 0.95 }))),
    false,
    true,
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.006;
  world.add(ground);

  // --- the house
  const house = new Group();
  house.position.set(-2.1, 0, -0.9);
  world.add(house);

  const W = 5.2;
  const D = 3.8;
  const H = 2.7;
  const wallMat = std('#eee9dd', 0.85);
  const walls = shadowed(new Mesh(track(new BoxGeometry(W, H, D)), wallMat));
  walls.position.y = H / 2;
  house.add(walls);

  const skirt = shadowed(new Mesh(track(new BoxGeometry(W + 0.12, 0.26, D + 0.12)), std('#c5bda9', 0.9)));
  skirt.position.y = 0.13;
  house.add(skirt);

  // windows glow on battery power after sunset
  const glassMat = track(
    new MeshStandardMaterial({
      color: '#13263a',
      roughness: 0.12,
      metalness: 0.1,
      emissive: new Color('#ffc46b'),
      emissiveIntensity: 0,
    }),
  );
  const frameMat = std('#f8f6f0', 0.6);
  const addWindow = (x: number, y: number, z: number, w: number, h: number, ry = 0) => {
    const g = new Group();
    const frame = shadowed(new Mesh(track(new BoxGeometry(w + 0.14, h + 0.14, 0.06)), frameMat), false, true);
    const glass = new Mesh(track(new BoxGeometry(w, h, 0.07)), glassMat);
    const mullion = new Mesh(track(new BoxGeometry(0.05, h, 0.08)), frameMat);
    g.add(frame, glass, mullion);
    g.position.set(x, y, z);
    g.rotation.y = ry;
    house.add(g);
  };
  addWindow(-1.45, 1.55, D / 2 + 0.02, 1.0, 1.0);
  addWindow(1.35, 1.55, D / 2 + 0.02, 1.0, 1.0);
  addWindow(W / 2 + 0.02, 1.55, -0.85, 0.9, 0.9, Math.PI / 2);

  const door = shadowed(new Mesh(track(new BoxGeometry(0.92, 2.02, 0.07)), std('#7a5236', 0.7)), false, true);
  door.position.set(-0.05, 1.01 + 0.13, D / 2 + 0.03);
  house.add(door);

  // roof: a gable of red corrugated sheets
  const pitch = MathUtils.degToRad(24);
  const overhang = 0.45;
  const halfRun = D / 2 + overhang;
  const slopeLen = halfRun / Math.cos(pitch);
  const rise = (D / 2) * Math.tan(pitch);
  const corrugation = track(corrugationNormal());
  corrugation.repeat.set(30, 1);
  const roofMat = track(
    new MeshStandardMaterial({
      color: '#b3432f',
      roughness: 0.52,
      metalness: 0.35,
      normalMap: corrugation,
    }),
  );
  roofMat.normalScale.set(0.9, 0.9);
  const sheetGeo = track(new BoxGeometry(W + overhang * 2, 0.07, slopeLen));
  const front = shadowed(new Mesh(sheetGeo, roofMat));
  front.rotation.x = pitch;
  front.position.set(0, H + rise - (Math.sin(pitch) * slopeLen) / 2 + 0.05, (Math.cos(pitch) * slopeLen) / 2);
  const back = shadowed(new Mesh(sheetGeo, roofMat));
  back.rotation.x = -pitch;
  back.position.set(0, front.position.y, -front.position.z);
  house.add(front, back);

  const ridge = shadowed(new Mesh(track(new CylinderGeometry(0.07, 0.07, W + overhang * 2, 10)), std('#8e3324', 0.5, 0.4)));
  ridge.rotation.z = Math.PI / 2;
  ridge.position.set(0, H + rise + 0.07, 0);
  house.add(ridge);

  const gableShape = new Shape();
  gableShape.moveTo(-D / 2, 0);
  gableShape.lineTo(D / 2, 0);
  gableShape.lineTo(0, rise);
  gableShape.closePath();
  const gableGeo = track(new ExtrudeGeometry(gableShape, { depth: 0.08, bevelEnabled: false }));
  for (const side of [-1, 1]) {
    const gable = shadowed(new Mesh(gableGeo, wallMat));
    gable.rotation.y = Math.PI / 2;
    gable.position.set(side * (W / 2) - (side > 0 ? 0.08 : 0), H, 0);
    house.add(gable);
  }

  // rooftop array: 2 rows x 4 landscape modules on rails, following the front slope
  const array = new Group();
  array.position.copy(front.position);
  array.rotation.x = pitch;
  house.add(array);
  const cellTex = track(cellTexture());
  cellTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const cellMat = track(
    new MeshPhysicalMaterial({
      map: cellTex,
      roughness: 0.3,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.3,
    }),
  );
  const aluMat = std('#c9ced6', 0.35, 0.8);
  const modGeo = track(new BoxGeometry(1.12, 0.045, 0.9));
  const modMats: Material[] = [aluMat, aluMat, cellMat, aluMat, aluMat, aluMat];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const m = shadowed(new Mesh(modGeo, modMats));
      m.position.set(-1.74 + c * 1.16, 0.16, -0.47 + r * 0.94);
      array.add(m);
    }
  }
  const railGeo = track(new BoxGeometry(4.7, 0.06, 0.06));
  for (const z of [-0.62, -0.32, 0.32, 0.62]) {
    const rail = shadowed(new Mesh(railGeo, std('#5b6470', 0.5, 0.6)), true, false);
    rail.position.set(0, 0.09, z);
    array.add(rail);
  }

  // hybrid inverter and battery on the right-hand wall
  const sideX = W / 2;
  const appliance = std('#f2f2ef', 0.45);
  const inverter = shadowed(new Mesh(track(new RoundedBoxGeometry(0.22, 0.66, 0.5, 2, 0.03)), appliance));
  inverter.position.set(sideX + 0.12, 1.78, 0.75);
  const screen = new Mesh(
    track(new BoxGeometry(0.01, 0.1, 0.2)),
    track(new MeshStandardMaterial({ color: '#0d2233', emissive: new Color('#8fd3ff'), emissiveIntensity: 0.9 })),
  );
  screen.position.set(sideX + 0.235, 1.9, 0.75);
  const battery = shadowed(new Mesh(track(new RoundedBoxGeometry(0.28, 1.02, 0.54, 2, 0.03)), std('#3d4652', 0.5, 0.2)));
  battery.position.set(sideX + 0.15, 0.72, 0.75);
  house.add(inverter, screen, battery);

  const ledOff = new Color('#3a4450');
  const ledOn = new Color('#ffb303');
  const ledMats: MeshStandardMaterial[] = [];
  for (let i = 0; i < 5; i++) {
    const mat = track(new MeshStandardMaterial({ color: '#1b2430', emissive: ledOff.clone(), emissiveIntensity: 1 }));
    ledMats.push(mat);
    const led = new Mesh(track(new BoxGeometry(0.01, 0.07, 0.16)), mat);
    led.position.set(sideX + 0.295, 0.82 + i * 0.09, 0.75);
    house.add(led);
  }

  // conduit from the array down the wall to the inverter
  array.updateMatrixWorld(true);
  house.updateMatrixWorld(true);
  const roofY = (z: number) => H + rise - z * Math.tan(pitch) + 0.09;
  const start = array.localToWorld(new Vector3(2.38, 0.1, 0.9));
  const overEdge = house.localToWorld(new Vector3(W / 2 + overhang + 0.12, roofY(1.45), 1.45));
  const underEave = house.localToWorld(new Vector3(sideX + 0.16, H - 0.25, 1.15));
  const end = house.localToWorld(new Vector3(sideX + 0.12, 2.12, 0.86));
  const conduitCurve = new CatmullRomCurve3([start, overEdge, underEave, end]);
  const conduit = shadowed(
    new Mesh(track(new TubeGeometry(conduitCurve, 48, 0.035, 8, false)), std('#2b2f36', 0.6)),
    true,
    false,
  );
  world.add(conduit);
  const conduitPoints = conduitCurve.getSpacedPoints(160);

  const pulseMat = track(new MeshBasicMaterial({ color: '#ffc43a' }));
  const pulses: Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const p = new Mesh(track(new SphereGeometry(0.06, 12, 8)), pulseMat);
    p.visible = false;
    world.add(p);
    pulses.push(p);
  }

  // a blue water tank on its stand, as on so many Luzon roofs and yards
  const tank = new Group();
  tank.position.set(-6.0, 0, -2.8);
  const tankBody = shadowed(new Mesh(track(new CylinderGeometry(0.45, 0.45, 0.95, 24)), std('#2d6cb1', 0.5)));
  tankBody.position.y = 2.1;
  const tankTop = shadowed(new Mesh(track(new CylinderGeometry(0.3, 0.45, 0.16, 24)), std('#2d6cb1', 0.5)));
  tankTop.position.y = 2.66;
  const deck = shadowed(new Mesh(track(new BoxGeometry(1.2, 0.08, 1.2)), std('#6b7480', 0.6, 0.5)));
  deck.position.y = 1.6;
  tank.add(tankBody, tankTop, deck);
  const legGeo = track(new BoxGeometry(0.07, 1.6, 0.07));
  for (const [lx, lz] of [
    [-0.52, -0.52],
    [0.52, -0.52],
    [-0.52, 0.52],
    [0.52, 0.52],
  ]) {
    const leg = shadowed(new Mesh(legGeo, std('#6b7480', 0.6, 0.5)));
    leg.position.set(lx, 0.8, lz);
    tank.add(leg);
  }
  world.add(tank);

  // trees
  const trunkMat = std('#6b4e35', 0.9);
  const leafMats = [std('#4f8046', 0.85), std('#5b8d4a', 0.85), std('#467640', 0.85)];
  leafMats.forEach((m) => (m.flatShading = true));
  const addTree = (x: number, z: number, s: number, k: number) => {
    const t = new Group();
    const trunk = shadowed(new Mesh(track(new CylinderGeometry(0.09 * s, 0.13 * s, 1.5 * s, 8)), trunkMat));
    trunk.position.y = 0.75 * s;
    const crown = shadowed(new Mesh(track(new IcosahedronGeometry(1.0 * s, 1)), leafMats[k % 3]));
    crown.position.y = 1.9 * s;
    crown.scale.set(1, 0.85, 1);
    const crown2 = shadowed(new Mesh(track(new IcosahedronGeometry(0.7 * s, 1)), leafMats[(k + 1) % 3]));
    crown2.position.set(0.55 * s, 1.55 * s, 0.3 * s);
    t.add(trunk, crown, crown2);
    t.position.set(x, 0, z);
    world.add(t);
  };
  addTree(-6.4, 1.6, 1.15, 0);
  addTree(3.9, -4.3, 1.25, 1);
  addTree(6.4, -1.2, 0.95, 2);

  // --- light
  const hemi = new HemisphereLight('#cfe3ff', '#3b402c', 0.8);
  scene.add(hemi);

  const sunLight = new DirectionalLight('#fff1dc', 2.4);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(opts.mobile ? 1024 : 2048, opts.mobile ? 1024 : 2048);
  sunLight.shadow.camera.left = -11;
  sunLight.shadow.camera.right = 11;
  sunLight.shadow.camera.top = 11;
  sunLight.shadow.camera.bottom = -11;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 60;
  sunLight.shadow.bias = -0.0004;
  sunLight.shadow.normalBias = 0.03;
  sunLight.shadow.radius = 4;
  sunLight.target.position.set(-1, 0, 0);
  scene.add(sunLight, sunLight.target);

  const porch = new PointLight('#ffb45a', 0, 9, 2);
  porch.position.set(house.position.x - 0.05, 2.45, house.position.z + D / 2 + 0.55);
  scene.add(porch);

  const sunDisc = new Mesh(
    track(new SphereGeometry(1, 32, 16)),
    track(new MeshBasicMaterial({ color: '#ffc93c', toneMapped: false })),
  );
  const glowTex = track(glowTexture());
  const glow = new Sprite(
    track(
      new SpriteMaterial({ map: glowTex, blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }),
    ),
  );
  scene.add(sunDisc, glow);

  // --- camera: framed automatically so the plinth fits whatever the canvas shape
  const camera = new PerspectiveCamera(30, 1, 0.1, 160);
  const target = new Vector3(0, 0.9, 0);
  const view = { az: 34, el: 23, r: 30 };
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  let scrollProgress = 0;
  let scrollEased = 0;
  const canvasSize = { w: 1, h: 1 };
  const shift = { x: 0, y: 0 }; // NDC offset applied with setViewOffset
  const FRAME = { halfX: 0.9, halfY: 0.66, centreY: -0.24 };

  const orbit = (azDeg: number, elDeg: number, out: Vector3) => {
    const az = MathUtils.degToRad(azDeg);
    const el = MathUtils.degToRad(elDeg);
    return out.set(
      target.x + view.r * Math.cos(el) * Math.sin(az),
      target.y + view.r * Math.sin(el),
      target.z + view.r * Math.cos(el) * Math.cos(az),
    );
  };

  const placeCamera = () => {
    orbit(view.az + pointer.cx * 5 + scrollEased * 14, view.el - pointer.cy * 3 + scrollEased * 5, camera.position);
    camera.lookAt(target);
  };

  const bounds: Vector3[] = [];
  for (const bx of [-8, 8]) for (const by of [-0.9, 4.4]) for (const bz of [-6, 6]) bounds.push(new Vector3(bx, by, bz));
  const probe = new Vector3();
  const extents = () => {
    orbit(view.az, view.el, camera.position);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const c of bounds) {
      probe.copy(c).project(camera);
      minX = Math.min(minX, probe.x);
      maxX = Math.max(maxX, probe.x);
      minY = Math.min(minY, probe.y);
      maxY = Math.max(maxY, probe.y);
    }
    return { minX, maxX, minY, maxY };
  };

  const fit = () => {
    camera.clearViewOffset();
    camera.updateProjectionMatrix();
    let lo = 10;
    let hi = 120;
    for (let i = 0; i < 22; i++) {
      view.r = (lo + hi) / 2;
      const e = extents();
      const fits = (e.maxX - e.minX) / 2 <= FRAME.halfX && (e.maxY - e.minY) / 2 <= FRAME.halfY;
      if (fits) hi = view.r;
      else lo = view.r;
    }
    view.r = hi;
    const e = extents();
    shift.x = (e.minX + e.maxX) / 2;
    shift.y = (e.minY + e.maxY) / 2 - FRAME.centreY;
    const { w, h } = canvasSize;
    camera.setViewOffset(w, h, (shift.x * w) / 2, (-shift.y * h) / 2, w, h);
  };

  // rest-pose camera frame, used to keep the visible sun inside the canvas
  const rest = { R: new Vector3(), U: new Vector3(), F: new Vector3(), pos: new Vector3() };
  const computeBasis = () => {
    orbit(view.az, view.el, rest.pos);
    rest.F.subVectors(target, rest.pos).normalize();
    rest.R.crossVectors(rest.F, new Vector3(0, 1, 0)).normalize();
    rest.U.crossVectors(rest.R, rest.F).normalize();
  };

  const sunPos = new Vector3();
  const tmpColor = new Color();
  const warm = new Color('#ff8a3f');
  const white = new Color('#fff3df');
  const skyNight = new Color('#1d2c4d');
  const skyDay = new Color('#d4e6ff');
  const state: SceneState = { time: 7.6, production: 0, battery: 0.5, night: 0, sky: '#0a3761' };

  const applyTime = (hours: number) => {
    const t = Math.min(21, Math.max(5, hours));
    const dayFrac = (t - SUNRISE) / (SUNSET - SUNRISE);
    const theta = Math.PI * dayFrac;
    const elevation = Math.sin(theta); // negative before sunrise and after sunset
    const above = dayFrac >= 0 && dayFrac <= 1;
    const e = above ? elevation : -Math.min(1, Math.abs(dayFrac < 0 ? dayFrac : dayFrac - 1) * 3);

    // visible sun: an arc across the canvas, far behind the diorama so it rises from behind it
    const k = MathUtils.clamp(dayFrac, -0.12, 1.12);
    const vx = -0.32 + 1.22 * k; // keep the glow clear of the headline on the left
    const vy = -0.08 + 0.93 * e;
    const px = vx + shift.x;
    const py = vy + shift.y;
    const depth = view.r + 22;
    const tanV = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const tanH = tanV * camera.aspect;
    sunPos
      .copy(rest.pos)
      .addScaledVector(rest.F, depth)
      .addScaledVector(rest.R, px * tanH * depth)
      .addScaledVector(rest.U, py * tanV * depth);
    sunDisc.position.copy(sunPos);
    sunDisc.scale.setScalar(depth * 0.017 * (1 + 0.25 * (1 - Math.max(0, e))));
    glow.position.copy(sunPos);
    glow.scale.setScalar(depth * 0.2);
    const visible = smooth(-0.1, 0.05, e);
    sunDisc.visible = visible > 0.01;
    glow.visible = visible > 0.01;
    (glow.material as SpriteMaterial).opacity = visible * (0.8 + 0.2 * (1 - e));

    // key light: same side of the sky as the visible sun, but from in front so the facade and array read
    const horizontalF = new Vector3(rest.F.x, 0, rest.F.z).normalize();
    const lightDir = new Vector3()
      .addScaledVector(rest.R, -Math.cos(Math.PI * k) * 0.85)
      .addScaledVector(new Vector3(0, 1, 0), 0.22 + 0.95 * Math.max(0, e))
      .addScaledVector(horizontalF, -0.6)
      .normalize();
    const light = smooth(-0.03, 0.42, e);
    const daylight = smooth(-0.05, 0.5, e);
    sunLight.position.copy(target).addScaledVector(lightDir, 26);
    sunLight.intensity = 2.8 * light;
    sunLight.color.copy(warm).lerp(white, smooth(0.08, 0.62, e));
    sunLight.castShadow = light > 0.02;

    const night = 1 - smooth(-0.1, 0.12, e);
    hemi.intensity = 0.36 + 0.56 * daylight;
    hemi.color.copy(skyNight).lerp(skyDay, daylight);
    renderer.toneMappingExposure = 0.94 + 0.12 * daylight;

    glassMat.emissiveIntensity = night * 1.9;
    porch.intensity = night * 14;

    const battery = interpolateStops(BATTERY_STOPS, t);
    const lit = Math.round(battery * 5);
    ledMats.forEach((m, i) => m.emissive.copy(i < lit ? ledOn : ledOff));

    state.time = t;
    state.production = above ? Math.pow(Math.max(0, elevation), 1.2) : 0;
    state.battery = battery;
    state.night = night;
    state.sky = `#${interpolateColour(SKY_STOPS, t, tmpColor).getHexString()}`;
    return state;
  };

  // --- render loop (on demand)
  let active = true;
  let raf = 0;
  let last = performance.now();
  let pulseClock = 0;
  // current flows along the conduit for a few seconds after the time changes, then the scene rests
  let pulseUntil = 0;
  const animatePulses = () => !opts.reducedMotion && state.production > 0.12 && performance.now() < pulseUntil;

  const frame = (now: number) => {
    raf = 0;
    // rAF timestamps can precede the moment the frame was requested, so never let dt go negative
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    pointer.cx += (pointer.x - pointer.cx) * Math.min(1, dt * 4);
    pointer.cy += (pointer.y - pointer.cy) * Math.min(1, dt * 4);
    scrollEased += (scrollProgress - scrollEased) * Math.min(1, dt * 6);
    placeCamera();

    const pulsing = animatePulses();
    pulses.forEach((p, i) => {
      p.visible = pulsing;
      if (!pulsing) return;
      const k = (((pulseClock * (0.18 + state.production * 0.22) + i / pulses.length) % 1) + 1) % 1;
      p.position.copy(conduitPoints[Math.min(conduitPoints.length - 1, Math.floor(k * conduitPoints.length))]);
    });
    if (pulsing) pulseClock += dt;

    renderer.render(scene, camera);

    const settling =
      Math.abs(pointer.x - pointer.cx) > 0.001 ||
      Math.abs(pointer.y - pointer.cy) > 0.001 ||
      Math.abs(scrollProgress - scrollEased) > 0.0005;
    if (active && (settling || pulsing)) request();
  };

  const request = () => {
    if (!raf && active) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    canvasSize.w = w;
    canvasSize.h = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.95 ? 33 : 30;
    fit();
    computeBasis();
    applyTime(state.time);
    request();
  };

  computeBasis();
  resize();

  const onContextLost = (e: Event) => {
    e.preventDefault();
    active = false;
    canvas.dispatchEvent(new CustomEvent('scene:lost', { bubbles: true }));
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  return {
    setTime(hours) {
      const s = applyTime(hours);
      pulseUntil = performance.now() + 5000;
      request();
      return { ...s };
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
      request();
    },
    setScroll(progress) {
      scrollProgress = progress;
      request();
    },
    setActive(next) {
      active = next;
      if (active) request();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    resize,
    dispose() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      scene.traverse((o: Object3D) => {
        const mesh = o as Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
