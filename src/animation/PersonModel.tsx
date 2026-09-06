// este componente carga un modelo 3D

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

export const PersonModel = (props: any) => {
  // referencia del modelo
  const modelRef = useRef(null);

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

  return <primitive object={gltf.scene} {...props} ref={modelRef} />;
};
