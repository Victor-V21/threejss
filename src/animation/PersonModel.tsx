// este componente carga un modelo 3D

import { useGLTF } from "@react-three/drei"

export const PersonModel = (props:any) => {

    const gltf = useGLTF("/models/person.glb")

    // se recorren todas las piezas del modelo
    gltf.scene.traverse((child:any) =>{

        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })

  return (
    <primitive object={gltf.scene} {...props} />
  )
}