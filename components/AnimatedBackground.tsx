import React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "react-three-fiber";

const Mesh = ({ index }: { index: number }) => {
  const ref = React.useRef<THREE.Mesh | null>(null);

  useFrame(() => {
    const value = Math.random() * 0.02;
    ref.current.rotation.x += value;
    ref.current.rotation.y += value;
    ref.current.rotation.z += value;
  });

  return (
    <mesh
      ref={ref}
      name={`cube-${index}`}
      position={[
        8000 * (2.0 * Math.random() - 1.0),
        8000 * (2.0 * Math.random() - 1.0),
        8000 * (2.0 * Math.random() - 1.0),
      ]}
      rotation={[
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ]}
    >
      <boxBufferGeometry attach="geometry" args={[250, 250, 250]} />
      <meshPhongMaterial
        attach="material"
        color={0x00ff00}
        /* @ts-ignore */
        specular={0xffff00}
        shininess={25}
      />
    </mesh>
  );
};

const Camera = () => {
  const ref = React.useRef<THREE.PerspectiveCamera | null>(null);
  const { setDefaultCamera, size } = useThree();
  React.useEffect(() => {
    setDefaultCamera(ref.current);
  }, []);
  useFrame(() => ref.current.updateMatrixWorld());
  return (
    <perspectiveCamera
      ref={ref}
      fov={40}
      aspect={size.width / size.height}
      near={1}
      far={15000}
      position={[0, 0, 250]}
    />
  );
};

const AnimatedBackground = () => {
  return (
    <>
      <Canvas
        style={{
          background: "#010303",
        }}
        resize={{
          debounce: 0,
          scroll: false,
        }}
        colorManagement={true}
      >
        <Camera />
        <directionalLight
          color={0xffffff}
          intensity={0.1}
          position={[0, -1, 0]}
        />
        <fog
          /* @ts-ignore */
          color={0x010303}
          near={3500}
          far={15000}
        />
        {Array.from({ length: 3000 }, (_x, i) => i).map((index) => (
          <Mesh index={index} key={`cube-${index}`} />
        ))}
      </Canvas>
      <style jsx>{`
        #particles {
          width: 100%;
          height: 100%;
          position: absolute;
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;
