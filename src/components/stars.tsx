import { Stars } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";


const StarsComp = () => {


  const starRef = useRef<any>();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    starRef.current.rotation.y = elapsedTime / 50;

  });


  return (
    <>
      <Stars
        radius={300}
        depth={100}
        count={10000}
        factor={7}
        saturation={0}
        fade={true}
        ref={starRef}
      />
    </>
  );
}


export default StarsComp;