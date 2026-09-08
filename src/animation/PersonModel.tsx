// este componente carga un modelo 3D

import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

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

    let moveX = 0;
    let moveZ = 0;
    const speed = 2;

    // calculamos el movimiento simple
    if (forward) moveZ += speed;
    if (backward) moveZ -= speed;
    if (left) moveX += speed;
    if (right) moveX -= speed;

    rigidBodyRef.current.setLinvel({ x: moveX, y: velocity.y, z: moveZ }, true);

    if (moveX !== 0 || moveZ !== 0) {
      // calculamos el angulo hacia donde nos movemos
      const angle = Math.atan2(moveX, moveZ);

      if (modelRef.current) {
        modelRef.current.rotation.y = angle;
      }
    }

    //  Sistema de camara 3ra persona

    if (modelRef.current) {
      // extraemos la posicición de la capsula
      const charPos = rigidBodyRef.current.translation();

      // extreamos el angulo de rotación actual del personaje
      const currentAngle = modelRef.current.rotation.y;

      // las distancias que tendremos de la camara
      const cameraDistance = 5;
      const cameraheight = 3;

      // calculamos la posición IDEAL de la caramara usando trigonometria
      const idealX = charPos.x - Math.sin(currentAngle) * cameraDistance;
      const idealZ = charPos.z - Math.cos(currentAngle) * cameraDistance;
      const idealY = charPos.y + cameraheight;

      const lerpSpeed = 0.1;

      camera.position.x += (idealX - camera.position.x) * lerpSpeed;
      camera.position.y += (idealY - camera.position.y) * lerpSpeed;
      camera.position.z += (idealZ - camera.position.z) * lerpSpeed;

      camera.lookAt(charPos.x, charPos.y + 1, charPos.z);
    }
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
