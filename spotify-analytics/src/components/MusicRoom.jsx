import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Box, Sphere, Cylinder, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Album Component
const Album = ({ album, position, isRecommended, onClick, isSelected }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Load album texture
  const texture = useTexture(album.imageUrl)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Rotation animation for recommended albums
      if (isRecommended) {
        meshRef.current.rotation.y += 0.01
      }
      
      // Hover effect
      if (hovered) {
        meshRef.current.scale.setScalar(1.1)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  return (
    <group position={position}>
      {/* Album Cover */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial 
          map={texture}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Glow effect for recommended albums */}
      {isRecommended && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial 
            color="#3b82f6"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0, 0.51]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshStandardMaterial 
            color="#10b981"
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* Album Info */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
        textAlign="center"
        font="/fonts/Inter-Bold.woff"
      >
        {album.name}
      </Text>
      
      <Text
        position={[0, -1, 0]}
        fontSize={0.08}
        color="#e5e7eb"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
        textAlign="center"
        font="/fonts/Inter-Regular.woff"
      >
        {album.artist}
      </Text>
    </group>
  )
}

// Stereo System Component
const StereoSystem = ({ position, isActive }) => {
  const stereoRef = useRef()
  
  useFrame((state) => {
    if (stereoRef.current && isActive) {
      // Pulse animation when active
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05
      stereoRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={stereoRef} position={position}>
      {/* Main Stereo Body */}
      <Box args={[2, 0.8, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
      
      {/* Speakers */}
      <Box args={[0.3, 0.6, 0.3]} position={[-0.8, 0, 0]}>
        <meshStandardMaterial color="#1a202c" />
      </Box>
      <Box args={[0.3, 0.6, 0.3]} position={[0.8, 0, 0]}>
        <meshStandardMaterial color="#1a202c" />
      </Box>
      
      {/* Speaker Grills */}
      <Cylinder args={[0.1, 0.1, 0.05, 8]} position={[-0.8, 0, 0.16]}>
        <meshStandardMaterial color="#4a5568" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.05, 8]} position={[0.8, 0, 0.16]}>
        <meshStandardMaterial color="#4a5568" />
      </Cylinder>
      
      {/* Control Panel */}
      <Box args={[1.2, 0.2, 0.1]} position={[0, 0.3, 0.46]}>
        <meshStandardMaterial color="#4a5568" />
      </Box>
      
      {/* Knobs */}
      <Cylinder args={[0.05, 0.05, 0.1, 8]} position={[-0.4, 0.3, 0.51]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.1, 8]} position={[0.4, 0.3, 0.51]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Cylinder>
      
      {/* Vinyl Player */}
      <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0, -0.3, 0.46]}>
        <meshStandardMaterial color="#1a202c" />
      </Cylinder>
      
      {/* Vinyl Record */}
      <Cylinder args={[0.25, 0.25, 0.02, 16]} position={[0, -0.3, 0.52]}>
        <meshStandardMaterial color="#2d3748" />
      </Cylinder>
      
      {/* Glow effect when active */}
      {isActive && (
        <Sphere args={[1.5, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#3b82f6"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  )
}

// Main Music Room Component
const MusicRoom = ({ albums, selectedGenres, selectedMoods, recommendations, currentView }) => {
  const { camera } = useThree()
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [albumPositions, setAlbumPositions] = useState([])
  
  // Calculate album positions in a circular arrangement
  useEffect(() => {
    if (albums.length > 0) {
      const radius = 8
      const positions = albums.map((album, index) => {
        const angle = (index / albums.length) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = 1.5 + Math.sin(angle * 2) * 0.5 // Varying heights
        return [x, y, z]
      })
      setAlbumPositions(positions)
    }
  }, [albums])

  // Camera animation
  useFrame((state) => {
    if (currentView === 'music-room') {
      // Gentle camera movement
      const time = state.clock.elapsedTime
      camera.position.x = Math.sin(time * 0.1) * 2
      camera.position.z = 5 + Math.cos(time * 0.1) * 1
      camera.lookAt(0, 0, 0)
    }
  })

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album)
    // You can add more interaction logic here
  }

  const isRecommended = (album) => {
    return recommendations.some(rec => rec.id === album.id)
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#3b82f6" />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f7fafc" />
      </mesh>
      
      {/* Walls */}
      <Box args={[20, 10, 0.1]} position={[0, 5, -10]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Box>
      <Box args={[0.1, 10, 20]} position={[-10, 5, 0]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Box>
      <Box args={[0.1, 10, 20]} position={[10, 5, 0]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Box>
      
      {/* Stereo System */}
      <StereoSystem 
        position={[0, 0, -3]} 
        isActive={recommendations.length > 0}
      />
      
      {/* Albums */}
      {albums.map((album, index) => (
        <Album
          key={album.id}
          album={album}
          position={albumPositions[index] || [0, 0, 0]}
          isRecommended={isRecommended(album)}
          isSelected={selectedAlbum?.id === album.id}
          onClick={() => handleAlbumClick(album)}
        />
      ))}
      
      {/* Room Title */}
      <Text
        position={[0, 8, -9]}
        fontSize={0.5}
        color="#1a202c"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Music Room
      </Text>
      
      {/* Recommendation Count */}
      {recommendations.length > 0 && (
        <Text
          position={[0, 7, -9]}
          fontSize={0.2}
          color="#3b82f6"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {recommendations.length} Recommendations
        </Text>
      )}
    </>
  )
}

export default MusicRoom 