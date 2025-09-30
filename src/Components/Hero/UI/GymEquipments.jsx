// GymEquipment3D.jsx - Enhanced with Lazy Loading + Advanced Memoization + useTransition
import React, { 
  useRef, 
  useEffect, 
  useCallback, 
  useMemo, 
  memo, 
  useState, 
  useTransition, 
  startTransition,
  Suspense,
  lazy 
} from "react";
import * as THREE from "three";

// Lazy load Three.js scene components
const ThreeJSScene = lazy(() => Promise.resolve({
  default: memo(({ mountRef, onSceneReady }) => {
    useEffect(() => {
      if (!mountRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      mountRef.current.appendChild(renderer.domElement);

      // Optimized lighting setup
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.setScalar(1024);
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
        handle.castShadow = true;
        handle.receiveShadow = true;
        group.add(handle);

        const weightGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 12);
        const weight1 = new THREE.Mesh(weightGeometry, metalMaterial);
        const weight2 = new THREE.Mesh(weightGeometry, metalMaterial);

        weight1.position.x = -1.2;
        weight2.position.x = 1.2;
        weight1.rotation.z = Math.PI / 2;
        weight2.rotation.z = Math.PI / 2;
        weight1.castShadow = true;
        weight2.castShadow = true;
        weight1.receiveShadow = true;
        weight2.receiveShadow = true;

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
      let animationId;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.01;

        // Optimized animation with cached calculations
        const sinTime = Math.sin(time);
        const cosTime = Math.cos(time);

        [dumbbell1, dumbbell2].forEach((item, index) => {
          item.rotation.x = Math.sin(time + index) * 0.2;
          item.rotation.y = time * 0.5 + index;
        });

        const cameraRadius = 12;
        camera.position.x = cosTime * 0.2 * cameraRadius;
        camera.position.z = sinTime * 0.2 * cameraRadius;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      window.addEventListener("resize", handleResize, { passive: true });

      // Notify parent that scene is ready
      if (onSceneReady) onSceneReady();

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        window.removeEventListener("resize", handleResize);
        
        // Dispose of Three.js resources
        scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        renderer.dispose();
      };
    }, [mountRef, onSceneReady]);

    return null;
  })
}));

// Loading fallback component
const ThreeJSLoader = memo(() => (
  <div className="absolute inset-0 -z-10 flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-black/50">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white/70 text-sm">Loading 3D Scene...</p>
    </div>
  </div>
));
ThreeJSLoader.displayName = 'ThreeJSLoader';

// Error fallback component
const ThreeJSError = memo(() => (
  <div className="absolute inset-0 -z-10 flex items-center justify-center bg-gradient-to-br from-red-900/20 to-black/50">
    <div className="text-center p-6 rounded-2xl bg-black/50 backdrop-blur-sm border border-red-500/20">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <span className="text-red-400 text-xl">⚠</span>
      </div>
      <p className="text-white/90 font-medium mb-2">3D Scene Unavailable</p>
      <p className="text-white/60 text-sm">Your device may not support WebGL</p>
    </div>
  </div>
));
ThreeJSError.displayName = 'ThreeJSError';

// Error boundary for Three.js
class ThreeJSErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Three.js scene error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ThreeJSError />;
    }
    return this.props.children;
  }
}

const GymEquipment3D = memo(() => {
  const mountRef = useRef(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const observerRef = useRef(null);

  // Memoized WebGL support check
  const webGLSupported = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch (e) {
      return false;
    }
  }, []);

  // Memoized scene ready callback
  const handleSceneReady = useCallback(() => {
    startTransition(() => {
      setIsSceneReady(true);
    });
  }, []);

  // Memoized intersection observer
  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      startTransition(() => {
        setIsIntersecting(true);
      });
    }
  }, []);

  // Intersection observer for performance optimization
  useEffect(() => {
    if (!mountRef.current || !webGLSupported) return;

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observerRef.current.observe(mountRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, webGLSupported]);

  // Memoized container className
  const containerClassName = useMemo(() => 
    `absolute inset-0 -z-10 transition-opacity duration-300 ${
      isPending ? 'opacity-90' : 'opacity-100'
    }`
  , [isPending]);

  // Don't render if WebGL is not supported
  if (!webGLSupported) {
    return <ThreeJSError />;
  }

  return (
    <div ref={mountRef} className={containerClassName}>
      <ThreeJSErrorBoundary>
        {isIntersecting && (
          <Suspense fallback={<ThreeJSLoader />}>
            <ThreeJSScene 
              mountRef={mountRef} 
              onSceneReady={handleSceneReady}
            />
          </Suspense>
        )}
        {!isIntersecting && <ThreeJSLoader />}
      </ThreeJSErrorBoundary>
    </div>
  );
});

// Display name for debugging
GymEquipment3D.displayName = 'GymEquipment3D';

export default GymEquipment3D;