import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Stars({ count = 600 }) {
    const ref = useRef()

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50
        }
        return pos
    }, [count])

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.008
        }
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#E8EAF0"
                sizeAttenuation
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

export default function ParticleField() {
    return (
        <div className="fixed inset-0 -z-20 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
                dpr={[1, 1.5]}
                frameloop="always"
            >
                <Stars count={600} />
            </Canvas>
        </div>
    )
}
