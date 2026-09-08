// este componente carga un modelo 3D

import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

import * as THREE from "three";

export const PersonModel = (props: any) => {
  // referencia del modelo
  const modelRef = useRef<any>(null);

  // creamos una referencia del cuerpo rigido
  const rigidBodyRef = useRef<any>(null);

  const [, get] = useKeyboardControls();

  // cargamos el modelo
  const gltf = useGLTF("/models/person.glb");

  // extraemos las acciones y animaciones del modelo
  const { actions, names } = useAnimations(gltf.animations, modelRef);

  // Extraemos la camara para 3ra. persona.
  const { camera } = useThree();

  // usamos useEffect para imprimir los nombres en la consola
  useEffect(() => {
    // ejecutamos la animación que vimos en la consola
    actions["Animation"]?.play();
  }, [names, actions]);

  // se recorren todas las piezas del modelo
  gltf.scene.traverse((child: any) => {
    // por cada hijo del modelo calculamos su sombra y recibo de luz por individual
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // carga 60 veces por segundo el estado del modelo
  useFrame(() => {
    const { forward, backward, left, right } = get();
    const velocity = rigidBodyRef.current.linvel();
    const speed = 5;

    // 1. Recoger el input WASD "Puro"
    const input = new THREE.Vector3(0, 0, 0);

    if (forward) input.z -= 1;
    if (backward) input.z += 1;
    if (left) input.x -= 1;
    if (right) input.x += 1;

    // Normalizamos para no caminar al doble de velocidad en diagonal
    input.normalize().multiplyScalar(speed);

    // 2. MAGIA: Transformar el input a relativo a la cámara
    // Obtenemos solo la rotación horizontal (Y) de la cámara
    const cameraEuler = new THREE.Euler().setFromQuaternion(
      camera.quaternion,
      "YXZ",
    );

    // Aplicamos ese ángulo de la cámara a nuestras teclas
    input.applyEuler(new THREE.Euler(0, cameraEuler.y, 0));

    // 3. Aplicar las físicas (movimiento relativo)
    rigidBodyRef.current.setLinvel(
      { x: input.x, y: velocity.y, z: input.z },
      true,
    );

    // 4. Rotar el personaje
    // Forzamos al personaje a mirar siempre hacia donde apunta el ratón (estilo shooter)
    if (modelRef.current) {
      modelRef.current.rotation.y = cameraEuler.y + Math.PI;
    }

    // 5. Cámara en 3ra Persona (Sobre el hombro)
    const charPos = rigidBodyRef.current.translation();

    // Primero, obligamos a la cámara a pararse exactamente en la cabeza del personaje
    camera.position.set(charPos.x, charPos.y + 1.5, charPos.z);

    // Luego, empujamos la cámara hacia atrás y hacia un lado de forma relativa a su vista
    camera.translateZ(4);
    camera.translateX(1);
  });

  return (
    <RigidBody ref={rigidBodyRef} colliders={false} lockRotations {...props}>
      {/* La cápsula de 1.8 metros se queda exactamente igual */}
      <CapsuleCollider args={[0.6, 0.3]} position={[0, 0.9, 0]} />

      {/* Encogemos el modelo a una fracción de su tamaño original */}
      <primitive object={gltf.scene} ref={modelRef} scale={0.2} />
    </RigidBody>
  );
};
