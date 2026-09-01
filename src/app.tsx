// App.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SpinningBox } from './animation/SpinningBox'
import { useHud } from './UI /HUDHook'

export const App = () => {

  // 1. El hook debe ir DENTRO del componente. Extraemos ambas variables.
  const { cubeVx, setCubeVx } = useHud();

  // 2. La función que usa el estado también debe ir dentro.
  const increaseCubeVx = () => {
    // Usamos setCubeVx para actualizar el valor. 
    // Por ejemplo, le sumamos 1 a la velocidad actual.
    setCubeVx(cubeVx + 1);
    
    console.log("Velocidad actual del cubo = ", cubeVx + 1);
  }
  return (
    <>
    <div className='text-center'>
      PVP
      <button className='bg-amber-500 text-3xl' onClick={increaseCubeVx}> Pressme</button>
      velocidad actual del cubo en el eje X : {cubeVx}
    </div>
    <div className="w-screen h-screen bg-neutral-900">
       <Canvas shadows>
        <OrbitControls />
        <ambientLight intensity={0.5}/>
        <directionalLight position={[5, 5, 5]} castShadow />

        {/* 1. Reemplazamos el mesh estático por el SpinningBox */}
        <SpinningBox position={[-1.5, 0, 0]} castShadow cubeVx={cubeVx}/>

        {/* La esfera sigue estática (por ahora) */}
        <mesh position={[1.5, 0, 0]} castShadow>
          <sphereGeometry/>
          <meshStandardMaterial />
        </mesh>

        {/* Suelo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]}/>
          <meshStandardMaterial color="gray"/>
        </mesh>
      </Canvas>
    </div>
    </>
  )
}