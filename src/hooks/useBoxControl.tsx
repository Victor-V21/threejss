import { useState } from 'react'

export const useBoxControl = () => {

    const [box, setBox] = useState<number>(0)
    
  return {

    // properties
    box,
    setBox
  }
}
