import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function CenterSphere() {
    const ref = useRef()
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.2
        }
    })

    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial
                color="#6C63FF"
                emissive="#6C63FF"
                emissiveIntensity={0.5}
                wireframe
                transparent
                opacity={0.6}
            />
        </mesh>
    )
}

function SkillNode({ skill, index, total, radius = 4 }) {
    const ref = useRef()
    const [hovered, setHovered] = useState(false)

    const angle = (index / total) * Math.PI * 2
    const y = (Math.random() - 0.5) * 3
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    useFrame((state) => {
        if (ref.current) {
            const time = state.clock.elapsedTime
            ref.current.position.x = Math.cos(angle + time * 0.2) * radius
            ref.current.position.z = Math.sin(angle + time * 0.2) * radius
            ref.current.position.y = y + Math.sin(time * 0.5 + index) * 0.3
        }
    })

    const colors = {
        Frontend: '#6C63FF',
        Backend: '#00D4FF',
        Tools: '#FFD166',
    }
    const color = colors[skill.category] || '#6C63FF'

    return (
        <Float speed={2} floatIntensity={0.3}>
            <group
                ref={ref}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <mesh scale={hovered ? 0.5 : 0.35}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 0.8 : 0.3}
                        transparent
                        opacity={0.9}
                    />
                </mesh>
                {hovered && (
                    <Text
                        position={[0, 0.8, 0]}
                        fontSize={0.3}
                        color="#E8EAF0"
                        anchorX="center"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/dmmono/v14/aFTU7PB1QTsUX8KYhh2aBYyMcKesfw.woff2"
                    >
                        {skill.name}
                    </Text>
                )}
            </group>
        </Float>
    )
}

function OrbitRings() {
    return (
        <>
            {[3, 4, 5].map((radius, i) => (
                <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, 0, i * 0.3]}>
                    <torusGeometry args={[radius, 0.005, 8, 100]} />
                    <meshBasicMaterial color="#6C63FF" transparent opacity={0.15} />
                </mesh>
            ))}
        </>
    )
}

function Scene({ skills }) {
    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#6C63FF" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D4FF" />

            <CenterSphere />
            <OrbitRings />

            {skills.map((skill, i) => (
                <SkillNode key={skill.id} skill={skill} index={i} total={skills.length} />
            ))}

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI * 3 / 4}
            />

            <EffectComposer>
                <Bloom intensity={1} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            </EffectComposer>
        </>
    )
}

export default function SkillOrbit({ skills = [] }) {
    return (
        <div className="w-full h-[500px] md:h-[600px]">
            <Canvas camera={{ position: [0, 2, 8], fov: 50 }} gl={{ alpha: true }}>
                <Scene skills={skills} />
            </Canvas>
        </div>
    )
}
