import { Stars } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";


const StarsComp = () => {


  const starRef = useRef<any>();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    starRef.current.rotation.y = elapsedTime / 40;

  });


  return (
    <>
      <Stars
        radius={300}
        depth={150}
        count={20000}
        factor={13}
        saturation={0}
        fade={true}
        ref={starRef}
      />
    </>
  );
}


export default StarsComp;