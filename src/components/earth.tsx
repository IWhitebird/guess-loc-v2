import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import EarthDayMap from "../assets/textures/8k_earth_daymap.jpg";
import EarthNormalMap from "../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../assets/textures/8k_earth_clouds.jpg";

import { TextureLoader } from "three";
import StarsComp from "./stars";

const Earth = () => {

  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
  );


  const earthRef = useRef<any>();
  const cloudsRef = useRef<any>();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    earthRef.current.rotation.y = elapsedTime / 12;
    cloudsRef.current.rotation.y = elapsedTime / 10;

  });

  return (
    <>
      <pointLight color="#f6f3ea" position={[1, 0, 5]} intensity={20.5} />

      <StarsComp />
      
      <mesh ref={cloudsRef} position={[0, 0, 3]}>
        <sphereGeometry args={[1.009, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.4}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
          />
      </mesh>


      <mesh ref={earthRef} position={[0, 0, 3]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          metalness={0}
          roughness={0.9}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
        />
      </mesh>
    </>
  );
}


export default Earth;