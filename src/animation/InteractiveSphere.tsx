// este componente hace que cambie de color la esfera al darle click

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react"
import { MathUtils, type Mesh } from "three";

export const InteractiveSphere = (props:any) => {

    // variables de estado para cambiar el color de la esfera
    const [color, setColor] = useState("hotpink");

    // variables de estado para almacenar hover
    const [hovered, setHovered] = useState(false)

    // referencia de mesh
    const meshRef = useRef<Mesh>(null!)
       
    useFrame((state, delta)=> {

        const objectiveScale = hovered ? 1.5 : 1 // identifica que escala debe de haber en la esfera por el hober
        
        if (meshRef.current){
            const newScale = MathUtils.lerp(meshRef.current.scale.x, objectiveScale, 0.1) // genera la nueva escala 
            meshRef.current.scale.set(newScale, newScale, newScale)
        }
    })

    //  funciónpara cambiar color de la esfera
    function ChangeColor () {
        
        // toma de decisiones para cambiar el color de la esfera 
        if (color === "hotpink"){
            setColor("lightblue")

        }else if (color === "lightblue"){
            setColor("hotpink")
        }
    }


    // funcionespara para modificar hovered, para cambio de escala de la esfera
    function OnPointerOverSphere() {
        setHovered(true)
    }

    function OnPointerOutSphere() {
        setHovered(false)
    }

    // funcion para realizar el cambio de escala con respecto a la variable de estado

    function ChangeScale() {
        
        if (hovered){
            return Number(1.5)
        } else {
            return Number(1)
        }
    }

    return(
    <mesh 
        // propiedades de la esfera
        {...props} ref= {meshRef}
        onClick={ChangeColor} 
        onPointerOver={OnPointerOverSphere}
        onPointerOut={OnPointerOutSphere}
        // scale={ChangeScale()}
        >
        
        {/* Elementos graficos de la esfera*/}
        <sphereGeometry/>
        <meshStandardMaterial color={color}/>
    </mesh>
  )
}
