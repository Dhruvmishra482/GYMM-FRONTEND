import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import {
  Play,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Settings,
  Apple,
} from "lucide-react";

// 3D Scene Component
const GymEquipment3D = ({ containerId }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 0.8, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Materials
    const metalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
    });

    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.8,
    });

    const rubberMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });

    // Create Dumbbell
    const createDumbbell = (x, y, z) => {
      const group = new THREE.Group();

      // Handle
      const handleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 12);
      const handle = new THREE.Mesh(handleGeometry, metalMaterial);
      handle.rotation.z = Math.PI / 2;
      group.add(handle);

      // Weights
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
      group.castShadow = true;
      group.receiveShadow = true;

      return group;
    };

    // Create Barbell
    const createBarbell = (x, y, z) => {
      const group = new THREE.Group();

      // Bar
      const barGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 12);
      const bar = new THREE.Mesh(barGeometry, metalMaterial);
      bar.rotation.z = Math.PI / 2;
      group.add(bar);

      // Plates
      const plateGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 16);
      for (let i = 0; i < 4; i++) {
        const plate = new THREE.Mesh(plateGeometry, metalMaterial);
        plate.position.x = i < 2 ? -2.5 + i * 0.3 : 2.2 + (i - 2) * 0.3;
        plate.rotation.z = Math.PI / 2;
        group.add(plate);
      }

      group.position.set(x, y, z);
      group.castShadow = true;
      group.receiveShadow = true;

      return group;
    };

    // Create Kettlebell
    const createKettlebell = (x, y, z) => {
      const group = new THREE.Group();

      // Body
      const bodyGeometry = new THREE.SphereGeometry(0.8, 16, 16);
      const body = new THREE.Mesh(bodyGeometry, metalMaterial);
      body.scale.y = 0.9;
      group.add(body);

      // Handle
      const handleGeometry = new THREE.TorusGeometry(0.6, 0.1, 8, 16);
      const handle = new THREE.Mesh(handleGeometry, metalMaterial);
      handle.position.y = 0.9;
      group.add(handle);

      group.position.set(x, y, z);
      group.castShadow = true;
      group.receiveShadow = true;

      return group;
    };

    // Create Medicine Ball
    const createMedicineBall = (x, y, z) => {
      const geometry = new THREE.SphereGeometry(0.7, 16, 16);
      const material = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
      const ball = new THREE.Mesh(geometry, material);

      ball.position.set(x, y, z);
      ball.castShadow = true;
      ball.receiveShadow = true;

      return ball;
    };

    // Add equipment to scene
    const dumbbell1 = createDumbbell(-5, 1, 2);
    const dumbbell2 = createDumbbell(5, -1, -2);
    const barbell = createBarbell(0, 2, -3);
    const kettlebell1 = createKettlebell(-3, -2, 3);
    const kettlebell2 = createKettlebell(4, 1.5, 1);
    const medicineBall = createMedicineBall(2, -1.5, 4);

    scene.add(
      dumbbell1,
      dumbbell2,
      barbell,
      kettlebell1,
      kettlebell2,
      medicineBall
    );

    // Camera position
    camera.position.set(0, 0, 10);

    // Animation variables
    let time = 0;
    const equipment = [
      dumbbell1,
      dumbbell2,
      barbell,
      kettlebell1,
      kettlebell2,
      medicineBall,
    ];

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate equipment
      equipment.forEach((item, index) => {
        item.rotation.x = Math.sin(time + index) * 0.2;
        item.rotation.y = time * 0.5 + index;
        item.position.y += Math.sin(time * 2 + index) * 0.002;
      });

      // Camera orbit
      camera.position.x = Math.cos(time * 0.2) * 12;
      camera.position.z = Math.sin(time * 0.2) * 12;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
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

// Navigation Component
const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-amber-400">💪 FitForge</div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#home"
                className="text-gray-300 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-gray-300 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-300 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-amber-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </a>
              <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <GymEquipment3D />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            FitForge
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          The ultimate gym management system that transforms how you manage
          members, trainers, and operations
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Get Started
          </button>
          <button className="border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105">
            Watch Demo
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Member Management",
      description:
        "Complete member profiles, subscription tracking, and automated renewals with advanced analytics.",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Class Scheduling",
      description:
        "Smart booking system for yoga, zumba, personal training with real-time availability updates.",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Payment Processing",
      description:
        "Seamless payment collection, invoice generation, and automated billing management.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description:
        "Real-time insights on member growth, revenue trends, and business performance metrics.",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Equipment Management",
      description:
        "Track gym equipment, maintenance schedules, and optimize resource allocation.",
    },
    {
      icon: <Apple className="w-8 h-8" />,
      title: "Nutrition Tracking",
      description:
        "Personalized diet plans, macro tracking, and nutrition guidance for members.",
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features for Modern Gyms
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to run a successful fitness business, all in one
            comprehensive platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-2xl border border-gray-600 hover:border-amber-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section
const Stats = () => {
  const stats = [
    { number: "500+", label: "Gyms Powered" },
    { number: "50K+", label: "Active Members" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-amber-500 to-yellow-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-black mb-6">
          Ready to Transform Your Gym?
        </h2>
        <p className="text-xl text-black/80 mb-8">
          Join hundreds of successful gym owners who trust FitForge to manage
          their business
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors">
            Start Free Trial
          </button>
          <button className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <CTA />
    </div>
  );
};

export default App;
