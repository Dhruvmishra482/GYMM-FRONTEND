import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const GymEquipment3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 0.8, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    const metalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
    });

    const createDumbbell = (x, y, z) => {
      const group = new THREE.Group();
      const handleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 12);
      const handle = new THREE.Mesh(handleGeometry, metalMaterial);
      handle.rotation.z = Math.PI / 2;
      group.add(handle);

      const weightGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 12);
      const weight1 = new THREE.Mesh(weightGeometry, metalMaterial);
      const weight2 = new THREE.Mesh(weightGeometry, metalMaterial);

      weight1.position.x = -1.2;
      weight2.position.x = 1.2;
      weight1.rotation.z = Math.PI / 2;
      weight2.rotation.z = Math.PI / 2;

      group.add(weight1);
      group.add(weight2);
      group.position.set(x, y, z);

      return group;
    };

    const dumbbell1 = createDumbbell(-5, 1, 2);
    const dumbbell2 = createDumbbell(5, -1, -2);
    scene.add(dumbbell1, dumbbell2);

    camera.position.set(0, 0, 10);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      [dumbbell1, dumbbell2].forEach((item, index) => {
        item.rotation.x = Math.sin(time + index) * 0.2;
        item.rotation.y = time * 0.5 + index;
      });

      camera.position.x = Math.cos(time * 0.2) * 12;
      camera.position.z = Math.sin(time * 0.2) * 12;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default GymEquipment3D;
