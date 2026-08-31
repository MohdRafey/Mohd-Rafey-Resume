import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
  const slabRef = useRef();
  const backLight1 = useRef();
  const backLight2 = useRef();

  useFrame((state) => {
    const x = state.pointer.x;
    const y = state.pointer.y;

    // Tilt the glass slab towards cursor
    slabRef.current.rotation.x = THREE.MathUtils.lerp(slabRef.current.rotation.x, (-y * Math.PI) / 16, 0.08);
    slabRef.current.rotation.y = THREE.MathUtils.lerp(slabRef.current.rotation.y, (x * Math.PI) / 16, 0.08);

    // Shift background light sources to create active chromatic caustics
    if (backLight1.current && backLight2.current) {
      backLight1.current.position.x = THREE.MathUtils.lerp(backLight1.current.position.x, x * 2.5, 0.1);
      backLight1.current.position.y = THREE.MathUtils.lerp(backLight1.current.position.y, y * 2.0, 0.1);
      backLight2.current.position.x = THREE.MathUtils.lerp(backLight2.current.position.x, -x * 2.0, 0.1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 4]} intensity={2.5} />
      <directionalLight position={[-5, -4, 2]} intensity={1.5} color="#818cf8" />

      {/* 1. Behind-the-Glass Refraction Emitters (What gets refracted) */}
      <group position={[0, 0, -0.6]}>
        {/* Dynamic Indigo Glow Orb */}
        <mesh ref={backLight1} position={[-1.2, 0.8, 0]}>
          <circleGeometry args={[0.9, 32]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.65} />
        </mesh>

        {/* Dynamic Amber/Cyan Caustic Orb */}
        <mesh ref={backLight2} position={[1.4, -0.7, 0]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>

        {/* High-contrast sub-grid lines for visible edge bending */}
        <gridHelper 
          args={[6, 12, '#818cf8', '#334155']} 
          rotation={[Math.PI / 2, 0, 0]} 
          position={[0, 0, -0.1]}
        />
      </group>

      {/* 2. Heavy Refractive 3D Glass Prism Slab */}
      <RoundedBox ref={slabRef} position={[0, 0, 0.2]} args={[4.5, 2.9, 0.45]} radius={0.42} smoothness={12}>
        <MeshTransmissionMaterial
          backside={false}
          samples={16}
          resolution={512}
          transmission={0.96}
          roughness={0.02}
          thickness={1.2}
          ior={1.62}                     // Dense Optical Flint Glass
          chromaticAberration={0.18}     // Strong RGB rainbow dispersion along bevels
          distortion={0.55}              // Pronounced geometric warping along edges
          distortionScale={0.4}
          temporalDistortion={0.0}
          attenuationDistance={1.4}
          attenuationColor="#ffffff"
          color="#ffffff"
          background={new THREE.Color('#07090e')}
        />
      </RoundedBox>
    </>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside the provider
    return { isLight: false, theme: 'dark', interactiveMode: 'shockwave' };
  }
  return context;
};

export default function RefractiveCard3D({ children, className = "" }) {
  return (
    <div className={`relative group rounded-[32px] overflow-hidden ${className}`}>
      {/* 3D WebGL Refraction Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Canvas 
          camera={{ position: [0, 0, 4.2], fov: 48 }} 
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Specular Edge Rim */}
      <div className="absolute inset-0 pointer-events-none z-[1] rounded-[32px] border border-white/20 shadow-[inset_0_2px_1.5px_rgba(255,255,255,0.55),inset_0_-1px_1px_rgba(0,0,0,0.4)]" />

      {/* HTML Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}