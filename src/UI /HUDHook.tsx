import { useState } from "react";

export const useHud = () => {
  const [cubeVx, setCubeVx] = useState<number>(1);

  const [debugMenu, setDebugMenu] = useState<boolean>(false);

  return {
    cubeVx,
    debugMenu,

    setCubeVx,
    setDebugMenu,
  };
};
