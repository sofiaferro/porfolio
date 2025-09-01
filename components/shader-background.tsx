'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

// Custom shader material for the organic background effect
const OrganicShaderMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    mouse: new THREE.Vector2(),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - creating the organic, flowing effect
  `
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 mouse;
    
    varying vec2 vUv;
    
    // Optimized noise functions for better performance
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      // Reduced iterations for better performance
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * 2.0;
      
      // Create flowing organic patterns with reduced complexity
      float t = time * 0.08;
      vec2 flow = vec2(
        fbm(p * 1.5 + vec2(t * 0.4, t * 0.2)),
        fbm(p * 1.5 + vec2(t * 0.2, t * 0.4))
      );
      
      // Main organic texture
      float organic = fbm(p * 2.5 + flow * 0.4 + t * 0.15);
      
      // Create depth with fewer layers
      float depth1 = fbm(p * 1.2 + flow * 0.2 + t * 0.08);
      
      // Combine layers for rich texture
      float final = organic * 0.7 + depth1 * 0.3;
      
      // Create the dark base with organic patterns
      vec3 darkBase = vec3(0.02, 0.02, 0.03);
      vec3 organicColor = vec3(0.1, 0.05, 0.02) * final;
      
      // Add flowing orange/red accents
      float accent = smoothstep(0.3, 0.7, fbm(p * 3.0 + flow * 0.6 + t * 0.2));
      vec3 accentColor = mix(
        vec3(0.8, 0.3, 0.1),  // Orange
        vec3(0.6, 0.1, 0.05), // Red
        accent
      );
      
      // Create glowing effect
      float glow = smoothstep(0.4, 0.8, fbm(p * 1.5 + flow * 0.5 + t * 0.15));
      vec3 glowColor = accentColor * glow * 0.3;
      
      // Combine all elements
      vec3 color = darkBase + organicColor + glowColor;
      
      // Add subtle mouse interaction
      float mouseDist = length(p - mouse * 0.5);
      float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);
      color += glowColor * mouseInfluence * 0.2;
      
      // Ensure we stay in valid color range
      color = clamp(color, 0.0, 1.0);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ OrganicShaderMaterial })

// Component that uses the shader material
function OrganicBackground() {
  const materialRef = useRef<any>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime
      materialRef.current.mouse = mouseRef.current
    }
  })
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <mesh>
      <planeGeometry args={[4, 4]} />
      <primitive object={new (OrganicShaderMaterial as any)()} ref={materialRef} />
    </mesh>
  )
}

// Fallback background for devices without WebGL support
function FallbackBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.05),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  )
}

// Main component that renders the Canvas
export default function ShaderBackground() {
  const [webglSupported, setWebglSupported] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglSupported(false)
      }
    } catch (e) {
      setWebglSupported(false)
    }
    
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])
  
  // Three.js handles canvas resizing automatically, no need for manual resize handling
  // The Canvas component will automatically update viewport dimensions
  
  if (!webglSupported) {
    return <FallbackBackground />
  }
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
          alpha: false
        }}
        dpr={[1, 2]} // Optimize for different device pixel ratios
        performance={{ min: 0.5 }} // Reduce quality on low-end devices
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.setSize(window.innerWidth, window.innerHeight)
        }}
      >
        <OrganicBackground />
      </Canvas>
    </div>
  )
}
