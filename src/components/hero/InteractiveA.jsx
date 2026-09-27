import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT_HIGH = 3000;
const PARTICLE_COUNT_MEDIUM = 1500;
const PARTICLE_COUNT_LOW = 700;

export default function InteractiveA({ isMobile = false }) {
  const pointsRef = useRef();
  const { viewport, size } = useThree();
  const globalMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e) => {
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const particleCount = useMemo(() => {
    if (isMobile) return PARTICLE_COUNT_LOW;
    if (size.width < 1024) return PARTICLE_COUNT_MEDIUM;
    return PARTICLE_COUNT_HIGH;
  }, [isMobile, size.width]);

  const { positions, colors, sizes, initialPositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const initPos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);

    const colorSignalWhite = new THREE.Color('#F5F7FF');
    const colorIonCyan = new THREE.Color('#29E3D9');
    const colorViolet = new THREE.Color('#6C4CE3');
    const colorMagenta = new THREE.Color('#E63C8C');

    for (let i = 0; i < particleCount; i++) {
      const segment = Math.random();
      
      let x = 0, y = 0, z = 0;
      const t = Math.random(); 

      const scaleY = 6;
      const scaleX = 4;
      const crossbarY = -1;

      if (segment < 0.4) {
        x = THREE.MathUtils.lerp(0, -scaleX, t);
        y = THREE.MathUtils.lerp(scaleY, -scaleY, t);
      } else if (segment < 0.8) {
        x = THREE.MathUtils.lerp(0, scaleX, t);
        y = THREE.MathUtils.lerp(scaleY, -scaleY, t);
      } else {
        const crossT = (crossbarY - scaleY) / (-scaleY - scaleY); // find t where y = -1
        const leftX = THREE.MathUtils.lerp(0, -scaleX, crossT);
        const rightX = THREE.MathUtils.lerp(0, scaleX, crossT);
        x = THREE.MathUtils.lerp(leftX, rightX, t);
        y = crossbarY;
      }

      const noiseLevel = 1.5;
      x += (Math.random() - 0.5) * noiseLevel;
      y += (Math.random() - 0.5) * noiseLevel;
      z += (Math.random() - 0.5) * (noiseLevel * 3); 

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;

      const colorRandom = Math.random();
      let pColor;
      let sizeVal = 0.05 + Math.random() * 0.05;

      if (colorRandom < 0.70) {
        pColor = colorSignalWhite;
      } else if (colorRandom < 0.90) {
        pColor = colorIonCyan;
      } else if (colorRandom < 0.98) {
        pColor = colorViolet;
      } else {
        pColor = colorMagenta;
        sizeVal = 0.15 + Math.random() * 0.1; 
      }

      col[i * 3] = pColor.r;
      col[i * 3 + 1] = pColor.g;
      col[i * 3 + 2] = pColor.b;
      
      sz[i] = sizeVal;
    }

    return { positions: pos, colors: col, sizes: sz, initialPositions: initPos };
  }, [particleCount]);

  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const geom = pointsRef.current.geometry;
    const posAttribute = geom.attributes.position;
    
    const mouseX = (globalMouse.current.x * viewport.width) / 2;
    const mouseY = (globalMouse.current.y * viewport.height) / 2;
    
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ix = initialPositions[i3];
        const iy = initialPositions[i3 + 1];
        const iz = initialPositions[i3 + 2];
        
        const floatX = Math.sin(time * 0.5 + iy) * 0.1;
        const floatY = Math.cos(time * 0.3 + ix) * 0.1;
        
        let newX = ix + floatX;
        let newY = iy + floatY;
        let newZ = iz;

        if (!isMobile) {
            const worldVec = new THREE.Vector3(newX, newY, newZ);
            worldVec.applyEuler(pointsRef.current.rotation);
            
            const distToMouse = Math.sqrt(
                Math.pow(worldVec.x - mouseX, 2) + 
                Math.pow(worldVec.y - mouseY, 2)
            );
            
            const radius = 3; 
            if (distToMouse < radius) {
                const force = (radius - distToMouse) / radius;
                newX += (worldVec.x - mouseX) * force * 0.2;
                newY += (worldVec.y - mouseY) * force * 0.2;
                newZ += force * 1.5;
            }
        }
        
        posAttribute.array[i3] += (newX - posAttribute.array[i3]) * 0.1;
        posAttribute.array[i3 + 1] += (newY - posAttribute.array[i3 + 1]) * 0.1;
        posAttribute.array[i3 + 2] += (newZ - posAttribute.array[i3 + 2]) * 0.1;
    }
    
    posAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
