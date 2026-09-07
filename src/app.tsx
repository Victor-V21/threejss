// App.tsx
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { SpinningBox } from "./animation/SpinningBox";
import { useHud } from "./UI /HUDHook";
import { InteractiveSphere } from "./animation/InteractiveSphere";
import { PersonModel } from "./animation/PersonModel";
import { Physics, RigidBody } from "@react-three/rapier";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
];

export const App = () => {
  // cargamos los hook de estado de interfaz UI
  const { cubeVx, setCubeVx, debugMenu, setDebugMenu } = useHud();

  const increaseCubeVx = () => {
    // Usamos setCubeVx para actualizar el valor.
    setCubeVx(cubeVx + 1);
  };

  function switchDebugMode() {
    if (debugMenu) {
      setDebugMenu(false);
    } else {
      setDebugMenu(true);
    }
  }

  return (
    <>
      <div className="text-center bg-cyan-50 grid">
        <div>
          Acelerar el cubo:
          <button
            className="bg-amber-300 p-0.5 m-1.5 rounded-md hover:bg-amber-400"
            onClick={increaseCubeVx}
          >
            Incrementar Vx
          </button>
          velocidad actual del cubo en el eje X : {cubeVx}
        </div>
        <div>
          Activar modo debug:
          <button
            className="bg-blue-400 text-white rounded-md p-0.5 m-1.5 hover:bg-blue-700"
            onClick={switchDebugMode}
          >
            {debugMenu ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>

      <KeyboardControls map={keyboardMap}>
        <div className="w-screen h-screen bg-neutral-900">
          <Canvas shadows>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} castShadow />

            {/* Aplicamos fisica a los elementos en pantalla */}

            <Physics debug={debugMenu}>
              {/* Cubo */}
              <RigidBody>
                <SpinningBox position={[-3, 0, 0]} castShadow cubeVx={cubeVx} />
              </RigidBody>
              {/* Esfera */}
              <RigidBody>
                <InteractiveSphere position={[0, 0, 0]} castShadow>
                  <sphereGeometry />
                  <meshStandardMaterial />
                </InteractiveSphere>
              </RigidBody>
              DSSSSSS
              {/* --- EL PERSONAJE --- */}
              <PersonModel scale={0.4} />
              {/* Suelo */}
              <RigidBody type="fixed">
                <mesh
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, -1.5, 0]}
                  receiveShadow
                >
                  <planeGeometry args={[10, 10]} />
                  <meshStandardMaterial color="gray" />
                </mesh>
              </RigidBody>
            </Physics>
          </Canvas>
        </div>
      </KeyboardControls>
    </>
  );
};
