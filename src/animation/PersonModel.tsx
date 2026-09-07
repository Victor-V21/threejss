// este componente carga un modelo 3D

import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

export const PersonModel = (props: any) => {
  // referencia del modelo
  const modelRef = useRef(null);

  const rigidBodyRef = useRef<any>(null);

  const [, get] = useKeyboardControls();

  // cargamos el modelo
  const gltf = useGLTF("/models/person.glb");

  // extraemos las acciones y animaciones del modelo
  const { actions, names } = useAnimations(gltf.animations, modelRef);

  // usamos useEffect para imprimir los nombres en la consola
  useEffect(() => {
    // mostramos las animaciones disponibles del modelo en la consola
    console.log("Animaciones disponibles: ", names);

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

  useFrame(() => {
    const { forward, backward, left, right } = get();

    const velocity = rigidBodyRef.current.linvel();

    let moveX = 0;
    let moveZ = 0;
    const speed = 1;

    if (forward) moveZ -= speed;
    if (backward) moveZ += speed;
    if (left) moveX -= speed;
    if (right) moveX += speed;

    rigidBodyRef.current.setLinvel({ x: moveX, y: velocity.y, z: moveZ }, true);
  });

  return (
    // lockRotations evita que el personaje se tropiece y ruede como un tronco
    <RigidBody ref={rigidBodyRef} colliders={false} lockRotations {...props}>
      <CapsuleCollider args={[1.2, 0.4]} position={[0, 1.6, 0]} />
      {/* El modelo visual ya no recibe las props de posición, las recibe el RigidBody */}
      <primitive object={gltf.scene} ref={modelRef} scale={0.4} />
    </RigidBody>
  );
};
