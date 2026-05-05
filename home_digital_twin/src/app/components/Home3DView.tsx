import { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Droplets, Wind, Flame, Activity, Cpu, Wifi, Power } from 'lucide-react';

interface ResourceUsage {
  electricity: number;
  water: number;
  gas: number;
  hvac: number;
}

interface RoomDef {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  sensors: { type: 'temp' | 'motion' | 'smoke' | 'water' | 'power'; offset: [number, number, number] }[];
  furniture?: { kind: 'sofa' | 'table' | 'bed' | 'fridge' | 'stove' | 'sink' | 'toilet' | 'car'; pos: [number, number, number]; size: [number, number, number]; color: string }[];
}

const roomResources: Record<string, ResourceUsage> = {
  'Living Room': { electricity: 450, water: 0, gas: 0, hvac: 280 },
  'Kitchen': { electricity: 820, water: 45, gas: 120, hvac: 150 },
  'Bedroom': { electricity: 180, water: 12, gas: 0, hvac: 320 },
  'Bathroom': { electricity: 120, water: 78, gas: 85, hvac: 100 },
  'Garage': { electricity: 95, water: 5, gas: 0, hvac: 50 },
};

const ROOM_HEIGHT = 1.4;

const rooms: RoomDef[] = [
  {
    name: 'Living Room',
    position: [-2.2, ROOM_HEIGHT / 2, -1.4],
    size: [3.6, ROOM_HEIGHT, 2.4],
    color: '#60a5fa',
    sensors: [
      { type: 'temp', offset: [-1.5, 0.55, -1] },
      { type: 'motion', offset: [1.5, 0.55, 1] },
      { type: 'power', offset: [0, -0.5, 1] },
    ],
    furniture: [
      { kind: 'sofa', pos: [-2.2, 0.2, -0.6], size: [2.4, 0.4, 0.7], color: '#475569' },
      { kind: 'table', pos: [-2.2, 0.15, -1.6], size: [1.2, 0.1, 0.6], color: '#78350f' },
    ],
  },
  {
    name: 'Kitchen',
    position: [1.8, ROOM_HEIGHT / 2, -1.4],
    size: [2.8, ROOM_HEIGHT, 2.4],
    color: '#f472b6',
    sensors: [
      { type: 'smoke', offset: [0, 0.55, 0] },
      { type: 'temp', offset: [-1, 0.55, 1] },
      { type: 'water', offset: [1, -0.5, -0.8] },
    ],
    furniture: [
      { kind: 'fridge', pos: [0.7, 0.5, -2.3], size: [0.6, 1.0, 0.5], color: '#e2e8f0' },
      { kind: 'stove', pos: [1.8, 0.25, -2.4], size: [0.7, 0.5, 0.5], color: '#1f2937' },
      { kind: 'sink', pos: [2.7, 0.3, -1.4], size: [0.4, 0.2, 0.6], color: '#94a3b8' },
    ],
  },
  {
    name: 'Bedroom',
    position: [-2.4, ROOM_HEIGHT / 2, 1.4],
    size: [3.2, ROOM_HEIGHT, 2.8],
    color: '#86efac',
    sensors: [
      { type: 'temp', offset: [-1.3, 0.55, 0] },
      { type: 'motion', offset: [1.3, 0.55, 1] },
    ],
    furniture: [
      { kind: 'bed', pos: [-2.4, 0.25, 1.6], size: [2.0, 0.5, 1.4], color: '#cbd5e1' },
    ],
  },
  {
    name: 'Bathroom',
    position: [0.0, ROOM_HEIGHT / 2, 1.0],
    size: [1.6, ROOM_HEIGHT, 1.4],
    color: '#fde047',
    sensors: [
      { type: 'water', offset: [0, 0.55, 0] },
      { type: 'temp', offset: [-0.6, 0.55, 0.5] },
    ],
    furniture: [
      { kind: 'toilet', pos: [-0.5, 0.25, 1.4], size: [0.4, 0.5, 0.5], color: '#f1f5f9' },
      { kind: 'sink', pos: [0.5, 0.25, 1.4], size: [0.4, 0.2, 0.4], color: '#cbd5e1' },
    ],
  },
  {
    name: 'Garage',
    position: [2.4, ROOM_HEIGHT / 2, 1.4],
    size: [1.4, ROOM_HEIGHT, 2.8],
    color: '#fb923c',
    sensors: [
      { type: 'motion', offset: [0, 0.55, 0] },
      { type: 'smoke', offset: [0, 0.55, 1] },
    ],
    furniture: [
      { kind: 'car', pos: [2.4, 0.25, 1.4], size: [1.0, 0.5, 1.8], color: '#1e293b' },
    ],
  },
];

const SENSOR_COLOR: Record<string, string> = {
  temp: '#fb923c',
  motion: '#a78bfa',
  smoke: '#f87171',
  water: '#38bdf8',
  power: '#facc15',
};

function Sensor({ position, color, active }: { position: [number, number, number]; color: string; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial;
      if (active) {
        m.emissiveIntensity = 1 + Math.sin(performance.now() * 0.005 + position[0]) * 0.6;
      } else {
        m.emissiveIntensity = 0;
      }
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial color={active ? color : '#475569'} emissive={active ? color : '#000000'} toneMapped={false} />
    </mesh>
  );
}

function DataPacket({ curve, color, speed, offset, active }: { curve: THREE.CatmullRomCurve3; color: string; speed: number; offset: number; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current || !active) return;
    const t = ((performance.now() * 0.0001 * speed + offset) % 1);
    const p = curve.getPoint(t);
    ref.current.position.copy(p);
  });
  if (!active) return null;
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
}

function Cable({ from, to, color, packets = 2, active = true }: { from: [number, number, number]; to: [number, number, number]; color: string; packets?: number; active?: boolean }) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid1 = new THREE.Vector3(start.x, 1.55, start.z);
    const mid2 = new THREE.Vector3(end.x, 1.55, end.z);
    return new THREE.CatmullRomCurve3([start, mid1, mid2, end]);
  }, [from, to]);

  const points = useMemo(() => curve.getPoints(40), [curve]);

  return (
    <>
      <Line points={points} color={active ? color : '#475569'} lineWidth={1.5} opacity={active ? 1 : 0.3} transparent />
      {Array.from({ length: packets }).map((_, i) => (
        <DataPacket key={i} curve={curve} color={color} speed={0.6 + i * 0.2} offset={i / packets} active={active} />
      ))}
    </>
  );
}

function Walls({ size, color, opacity }: { size: [number, number, number]; color: string; opacity: number }) {
  const [w, h, d] = size;
  const t = 0.05;
  const matProps = { color, transparent: true, opacity, roughness: 0.5, metalness: 0.05 };
  return (
    <>
      <mesh position={[0, 0, -d / 2 + t / 2]}>
        <boxGeometry args={[w, h, t]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[0, 0, d / 2 - t / 2]}>
        <boxGeometry args={[w, h, t]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[-w / 2 + t / 2, 0, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[w / 2 - t / 2, 0, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
    </>
  );
}

function Room({ room, selected, onSelect, hubPos, active }: { room: RoomDef; selected: boolean; onSelect: () => void; hubPos: [number, number, number]; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = selected ? Math.sin(performance.now() * 0.002) * 0.05 : 0;
    groupRef.current.position.y += (target - groupRef.current.position.y) * 0.1;
  });

  const opacity = active ? (selected ? 0.45 : hovered ? 0.32 : 0.22) : (selected ? 0.25 : 0.1);
  const roomColor = active ? room.color : '#64748b';
  const sensorAbs = (off: [number, number, number]): [number, number, number] => [
    room.position[0] + off[0],
    room.position[1] + off[1],
    room.position[2] + off[2],
  ];

  return (
    <group ref={groupRef}>
      <group position={room.position}>
        {/* Floor */}
        <mesh
          position={[0, -room.size[1] / 2 + 0.01, 0]}
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
          receiveShadow
        >
          <boxGeometry args={[room.size[0] - 0.05, 0.02, room.size[2] - 0.05]} />
          <meshStandardMaterial color={roomColor} emissive={roomColor} emissiveIntensity={active ? (selected ? 0.5 : 0.15) : 0} />
        </mesh>

        {/* Translucent walls */}
        <Walls size={room.size} color={roomColor} opacity={opacity} />

        {/* Edges outline */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...room.size)]} />
          <lineBasicMaterial color={selected ? '#ffffff' : roomColor} transparent opacity={active ? 0.9 : 0.3} />
        </lineSegments>

        {/* Furniture */}
        {room.furniture?.map((f, i) => (
          <mesh key={i} position={[f.pos[0] - room.position[0], f.pos[1] - room.position[1], f.pos[2] - room.position[2]]} castShadow receiveShadow>
            <boxGeometry args={f.size} />
            <meshStandardMaterial color={active ? f.color : '#94a3b8'} roughness={0.6} />
          </mesh>
        ))}

        {/* Sensors */}
        {room.sensors.map((s, i) => (
          <Sensor key={i} position={s.offset} color={SENSOR_COLOR[s.type]} active={active} />
        ))}

        {/* Label */}
        <Html
          position={[0, room.size[1] / 2 + 0.3, 0]}
          center
          distanceFactor={9}
          style={{ pointerEvents: 'none', transition: 'opacity 0.2s', opacity: active ? 1 : 0.5 }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              color: roomColor,
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              border: `1px solid ${roomColor}`,
              whiteSpace: 'nowrap',
              boxShadow: active ? `0 0 8px ${roomColor}66` : 'none',
            }}
          >
            {room.name} {!active && '(Offline)'}
          </div>
        </Html>
      </group>

      {/* Cables from each sensor to the hub */}
      {room.sensors.map((s, i) => (
        <Cable key={i} from={sensorAbs(s.offset)} to={hubPos} color={SENSOR_COLOR[s.type]} packets={1} active={active} />
      ))}
    </group>
  );
}

function Hub({ position, active }: { position: [number, number, number]; active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (active && ringRef.current) ringRef.current.rotation.y += 0.01;
    if (coreRef.current) {
      const m = coreRef.current.material as THREE.MeshStandardMaterial;
      if (active) {
        m.emissiveIntensity = 1.5 + Math.sin(performance.now() * 0.004) * 0.5;
      } else {
        m.emissiveIntensity = 0;
      }
    }
  });

  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.4, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={active ? "#22d3ee" : "#475569"} emissive={active ? "#22d3ee" : "#000000"} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.012, 8, 32]} />
        <meshStandardMaterial color={active ? "#22d3ee" : "#475569"} emissive={active ? "#22d3ee" : "#000000"} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <Html position={[0, 0.6, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(8, 47, 73, 0.95)', color: active ? '#22d3ee' : '#94a3b8', padding: '2px 8px',
          borderRadius: 4, fontSize: 11, fontWeight: 600, border: `1px solid ${active ? '#22d3ee' : '#64748b'}`, whiteSpace: 'nowrap',
        }}>
          SMART HUB {!active && '(Offline)'}
        </div>
      </Html>
    </group>
  );
}

function Roof() {
  return (
    <group position={[0, 1.45, 0]}>
      <mesh castShadow>
        <boxGeometry args={[8.6, 0.08, 6.1]} />
        <meshStandardMaterial color="#334155" roughness={0.8} transparent opacity={0.25} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(8.6, 0.08, 6.1)]} />
        <lineBasicMaterial color="#64748b" />
      </lineSegments>
    </group>
  );
}

function Scene({ selectedRoom, setSelectedRoom, activeRooms }: { selectedRoom: string | null; setSelectedRoom: (n: string | null) => void; activeRooms: Record<string, boolean> }) {
  const hubPos: [number, number, number] = [0, 0.2, -2.6];
  const anyActive = Object.values(activeRooms).some(Boolean);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 4, -5]} intensity={0.3} />
      <pointLight position={hubPos} color={anyActive ? "#22d3ee" : "#475569"} intensity={anyActive ? 1.5 : 0.2} distance={6} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow onClick={() => setSelectedRoom(null)}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} />
      </mesh>

      <Grid
        position={[0, 0.001, 0]}
        args={[24, 24]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={22}
        infiniteGrid
      />

      {/* Foundation slab */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[8.6, 0.08, 6.1]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      <Hub position={hubPos} active={anyActive} />

      {rooms.map((room) => (
        <Room
          key={room.name}
          room={room}
          selected={selectedRoom === room.name}
          onSelect={() => setSelectedRoom(room.name)}
          hubPos={hubPos}
          active={activeRooms[room.name] !== false}
        />
      ))}

      <Roof />
    </>
  );
}

export function Home3DView() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [activeRooms, setActiveRooms] = useState<Record<string, boolean>>(
    rooms.reduce((acc, r) => ({ ...acc, [r.name]: true }), {})
  );

  const toggleRoom = (roomName: string) => {
    setActiveRooms(prev => ({ ...prev, [roomName]: !prev[roomName] }));
  };

  const toggleAll = (active: boolean) => {
    const newState = rooms.reduce((acc, r) => ({ ...acc, [r.name]: active }), {});
    setActiveRooms(newState);
  };

  const sensorLegend = [
    { type: 'Temperature', color: SENSOR_COLOR.temp },
    { type: 'Motion', color: SENSOR_COLOR.motion },
    { type: 'Smoke', color: SENSOR_COLOR.smoke },
    { type: 'Water leak', color: SENSOR_COLOR.water },
    { type: 'Power meter', color: SENSOR_COLOR.power },
  ];

  return (
    <div className="bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-slate-100">3D Home Twin</h3>
        </div>
        <span className="text-xs text-slate-400">Drag to rotate · Scroll to zoom · Click room to select</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: 3D Twin (Smaller) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-lg overflow-hidden border border-slate-700 w-full" style={{ height: 480, background: 'linear-gradient(180deg, #0b1224 0%, #1e293b 100%)' }}>
            <Canvas shadows camera={{ position: [6.5, 5.5, 6.5], fov: 45 }}>
              <Suspense fallback={null}>
                <Scene selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} activeRooms={activeRooms} />
              </Suspense>
              <OrbitControls
                enableDamping
                dampingFactor={0.08}
                minDistance={3}
                maxDistance={25}
                maxPolarAngle={Math.PI / 2.05}
                target={[0, 0.6, 0]}
              />
            </Canvas>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart hub</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live data stream</span>
            </div>
            {sensorLegend.map((s) => (
              <div key={s.type} className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                <span>{s.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Control Pane */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
            <h4 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Power className="w-4 h-4" />
              Master Controls
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => toggleAll(true)}
                className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm font-medium transition-colors"
              >
                Enable All
              </button>
              <button
                onClick={() => toggleAll(false)}
                className="flex-1 py-2 px-3 bg-red-900/50 hover:bg-red-900/80 text-red-200 border border-red-800/50 rounded text-sm font-medium transition-colors"
              >
                Kill All
              </button>
            </div>
          </div>

          {selectedRoom ? (
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-800 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-slate-100">{selectedRoom}</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={activeRooms[selectedRoom]}
                    onChange={() => toggleRoom(selectedRoom)}
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3 p-3 rounded bg-slate-900/80 border border-slate-700/50">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-xs text-slate-400">Electricity</p>
                    <p className="text-sm text-slate-100 font-medium">
                      {activeRooms[selectedRoom] ? roomResources[selectedRoom].electricity : 0} W
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-slate-900/80 border border-slate-700/50">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-400">Water</p>
                    <p className="text-sm text-slate-100 font-medium">
                      {activeRooms[selectedRoom] ? roomResources[selectedRoom].water : 0} L
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-slate-900/80 border border-slate-700/50">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-xs text-slate-400">Gas</p>
                    <p className="text-sm text-slate-100 font-medium">
                      {activeRooms[selectedRoom] ? roomResources[selectedRoom].gas : 0} kW
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-slate-900/80 border border-slate-700/50">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-slate-400">HVAC</p>
                    <p className="text-sm text-slate-100 font-medium">
                      {activeRooms[selectedRoom] ? roomResources[selectedRoom].hvac : 0} W
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-slate-700 border-dashed bg-slate-800/30 flex-1 flex items-center justify-center text-center">
              <p className="text-slate-400 text-sm">
                Click on a room in the 3D twin to view its details and controls.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
