import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FloatingGeometry({ position, geometry, color, speed = 1, distort = 0.3 }) {
    const meshRef = useRef()

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.5
            meshRef.current.rotation.y += 0.004 * speed
        }
    })

    return (
        <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.8}>
            <mesh ref={meshRef} position={position}>
                {geometry === 'sphere' && <sphereGeometry args={[1, 24, 24]} />}
                {geometry === 'torus' && <torusGeometry args={[1, 0.4, 12, 24]} />}
                {geometry === 'dodecahedron' && <dodecahedronGeometry args={[1]} />}
                {geometry === 'octahedron' && <octahedronGeometry args={[1]} />}
                {geometry === 'icosahedron' && <icosahedronGeometry args={[1]} />}
                <MeshDistortMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.3}
                    roughness={0.3}
                    metalness={0.7}
                    distort={distort}
                    speed={1.5}
                    transparent
                    opacity={0.8}
                />
            </mesh>
        </Float>
    )
}

function Particles({ count = 300 }) {
    const points = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30
        }
        return positions
    }, [count])

    const ref = useRef()

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.015
        }
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={points}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#6C63FF"
                sizeAttenuation
                transparent
                opacity={0.7}
            />
        </points>
    )
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#6C63FF" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />

            <FloatingGeometry position={[-3, 1.5, -2]} geometry="dodecahedron" color="#6C63FF" speed={0.8} distort={0.3} />
            <FloatingGeometry position={[3.5, -1, -3]} geometry="torus" color="#00D4FF" speed={1.2} distort={0.15} />
            <FloatingGeometry position={[-1.5, -2, -1]} geometry="octahedron" color="#FF6B6B" speed={0.6} distort={0.2} />
            <FloatingGeometry position={[2, 2.5, -4]} geometry="sphere" color="#FFD166" speed={1} distort={0.3} />
            <FloatingGeometry position={[0, 0, -6]} geometry="icosahedron" color="#6C63FF" speed={0.4} distort={0.15} />

            <Particles count={300} />
        </>
    )
}

export default function FloatingHeroScene() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent' }}
            >
                <Scene />
            </Canvas>
        </div>
    )
}
