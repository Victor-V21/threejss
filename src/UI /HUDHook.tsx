import { useState } from "react"

export const useHud = () => {

    const [cubeVx, setCubeVx] = useState<number>(1);

    return {
        cubeVx,
        setCubeVx
    }
}