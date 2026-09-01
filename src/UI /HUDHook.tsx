import { useState } from "react"

export const useHud = () => {

    const [cubeVx, setCubeVx] = useState<number>(0);

    return {
        cubeVx,
        setCubeVx
    }
}