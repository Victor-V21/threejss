import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export const SpinningBox = ({cubeVx, ...props}:any) => {
  
  // 1. Creamos la referencia al objeto mesh de three.js
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // 2. Suscribir este compoente al bucle de renderizado
  useFrame((state, delta) => {
    // este codigo se ejecuta aprox. 60 veces por segundo
    // state : contiene info de la escena, camara, reloj.
    // delta : es el tiempo exacto que pasó desde el frame anterior.

    const time = state.clock.elapsedTime;

    if (meshRef.current) {
        // Modificamos la rotación del obketo three.js DIRECTAMENTE
        // Usamos delta para que gire a velocidad constante independientemente de los FPS
        meshRef.current.position.y = Math.sin(time) * 0.5
        meshRef.current.rotation.y += 0.5 * delta // rota 0.5 radianes p/s en Y
        meshRef.current.rotation.x += cubeVx * delta // roración acelerada por boton en el eje x
    }
  })

  // 3. Retornar el mesh, vinculando la referencia con ref={meshRef}
  // Pasamos {...Props} para que reciva position, castShadow, etc., desde el padre.
    return (
    <mesh {...props} ref={meshRef}>
        <boxGeometry/>
        <meshStandardMaterial color="orange"/>
    </mesh>
  )
}
