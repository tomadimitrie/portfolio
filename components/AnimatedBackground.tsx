import React from "react";
import * as THREE from "three";

const AnimatedBackground = () => {
  const particlesRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      40,
      particlesRef.current.clientWidth / particlesRef.current.clientHeight,
      1,
      15000
    );
    camera.position.z = 250;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
    scene.fog = new THREE.Fog(scene.background.getHex(), 3500, 15000);

    const geometry = new THREE.BoxBufferGeometry(250, 250, 250);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      specular: 0x00ff00,
      shininess: 50,
    });

    const meshes: THREE.Mesh[] = [];

    for (let i = 0; i < 3000; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = `cube-${i}`;
      mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
      mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
      mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      scene.add(mesh);
      meshes.push(mesh);
    }
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.1);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(dirLight);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    particlesRef.current.appendChild(renderer.domElement);

    const onWindowResize = () => {
      renderer.setSize(
        particlesRef.current.clientWidth,
        particlesRef.current.clientHeight
      );
      camera.aspect =
        particlesRef.current.clientWidth / particlesRef.current.clientHeight;
      camera.updateProjectionMatrix();
    };
    const animate = () => {
      requestAnimationFrame(animate);
      meshes.forEach(mesh => {
        const value = Math.random() * 0.02;
        mesh.rotation.x += value;
        mesh.rotation.y += value;
        mesh.rotation.z += value;
      });
      renderer.render(scene, camera);
    };
    animate();
    window.addEventListener("resize", onWindowResize, false);
  }, []);

  return (
    <>
      <div id="particles" ref={particlesRef}></div>
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
