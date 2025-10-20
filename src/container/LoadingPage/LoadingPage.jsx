// import React, { useEffect } from 'react';
// import gsap from 'gsap';
// import "./loadingPage.css";

// const LoadingPage = () => {
//   useEffect(() => {
//     function loadingAnimation() {
//       gsap.fromTo(
//         "#nav",
//         { opacity: 0 },
//         {
//           opacity: 1,
//           duration: 1.5,
//           delay: 4,
//         }
//       );

//       gsap.fromTo(
//         ".loading-page",
//         { opacity: 1 },
//         {
//           opacity: 0,
//           display: "none",
//           duration: 1.5,
//           delay: 3.7,
//         }
//       );

//       gsap.fromTo(
//         ".logo-name",
//         {
//           y: 50,
//           opacity: 0,
//         },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 2,
//           delay: 0.5,
//         }
//       );
//     }

//     loadingAnimation();
//   }, []);

//   return (
//     <div className="loading-page">
//       <svg id="svg" width="210px" height="210px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
//         <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
//       </svg>
//       <div className="name-container">
//         <div className="logo-name">Gagan</div>
//       </div>
//     </div>
//   );
// }

// export default LoadingPage;

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import "./loadingPage.css";

const LoadingPage = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const tunnelRef = useRef(null);
  const particleSystemRef = useRef(null);
  const streaksRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // Track mouse position for interactive effects
    const handleMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY) / 100;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation phases timing
    const PHASE_1_DURATION = 3; // Wormhole expansion
    const PHASE_2_DURATION = 5; // High-speed warp
    const PHASE_3_DURATION = 2; // Smooth exit

    // Three.js setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Helper function to generate canvas texture for the tunnel
    const generateTunnelTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Create a radial gradient for the vortex effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      gradient.addColorStop(0, 'rgba(25, 25, 112, 0.5)');
      gradient.addColorStop(0.2, 'rgba(72, 61, 139, 0.4)');
      gradient.addColorStop(0.4, 'rgba(106, 90, 205, 0.3)');
      gradient.addColorStop(0.6, 'rgba(138, 43, 226, 0.2)');
      gradient.addColorStop(0.8, 'rgba(186, 85, 211, 0.1)');
      gradient.addColorStop(1, 'rgba(221, 160, 221, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add swirl effect with lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 100 + i * 10;
        
        ctx.beginPath();
        for (let j = 0; j < Math.PI * 2; j += 0.1) {
          const x = canvas.width / 2 + Math.cos(j + angle) * radius;
          const y = canvas.height / 2 + Math.sin(j + angle) * radius;
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      
      return canvas;
    };

    // Create the wormhole tunnel
    const tunnelGeometry = new THREE.CylinderGeometry(10, 25, 2000, 32, 50, true);
    // Flip the geometry inside out
    tunnelGeometry.scale(-1, 1, 1);
    
    const tunnelTexture = new THREE.CanvasTexture(generateTunnelTexture());
    tunnelTexture.wrapS = THREE.RepeatWrapping;
    tunnelTexture.wrapT = THREE.RepeatWrapping;
    tunnelTexture.repeat.set(5, 30);
    
    const tunnelMaterial = new THREE.MeshBasicMaterial({
      map: tunnelTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0
    });
    
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.rotation.x = Math.PI / 2;
    scene.add(tunnel);
    tunnelRef.current = tunnel;

    // Create star particles
    const particleCount = 3000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = []; // For storing particle movement speeds
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Position stars in a cylindrical formation around the tunnel
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 400;
      const zPos = -500 + Math.random() * 1000;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = zPos;
      
      // Store velocity for animation
      velocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 5 // Faster movement on Z-axis
      });
      
      // Assign color based on distance from center to create gradients
      const distanceFromCenter = Math.sqrt(
        Math.pow(positions[i * 3], 2) + 
        Math.pow(positions[i * 3 + 1], 2)
      ) / 500;
      
      // Create a beautiful gradient from cyan to magenta
      colors[i * 3] = 0.2 + distanceFromCenter * 0.8; // R
      colors[i * 3 + 1] = 0.5 - distanceFromCenter * 0.3; // G
      colors[i * 3 + 2] = 0.8; // B
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    particleSystemRef.current = { system: particleSystem, velocities, positions };

    // Create light streaks for the high-speed effect
    const streakCount = 100;
    const streakGeometry = new THREE.BufferGeometry();
    const streakPositions = new Float32Array(streakCount * 6); // Each streak has 2 points (start and end)
    const streakColors = new Float32Array(streakCount * 6);
    
    for (let i = 0; i < streakCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 100;
      const zPos = -200 + Math.random() * 400;
      const length = 20 + Math.random() * 60;
      
      // Start point
      streakPositions[i * 6] = Math.cos(angle) * radius;
      streakPositions[i * 6 + 1] = Math.sin(angle) * radius;
      streakPositions[i * 6 + 2] = zPos;
      
      // End point
      streakPositions[i * 6 + 3] = Math.cos(angle) * radius;
      streakPositions[i * 6 + 4] = Math.sin(angle) * radius;
      streakPositions[i * 6 + 5] = zPos - length;
      
      // Assign colors (bright neon colors)
      const colorChoice = Math.random();
      
      // Start color
      if (colorChoice < 0.3) {
        // Cyan
        streakColors[i * 6] = 0;
        streakColors[i * 6 + 1] = 1;
        streakColors[i * 6 + 2] = 1;
      } else if (colorChoice < 0.6) {
        // Purple
        streakColors[i * 6] = 0.5;
        streakColors[i * 6 + 1] = 0;
        streakColors[i * 6 + 2] = 1;
      } else {
        // Pink
        streakColors[i * 6] = 1;
        streakColors[i * 6 + 1] = 0.2;
        streakColors[i * 6 + 2] = 0.8;
      }
      
      // End color (fade to white for glow effect)
      streakColors[i * 6 + 3] = streakColors[i * 6];
      streakColors[i * 6 + 4] = streakColors[i * 6 + 1];
      streakColors[i * 6 + 5] = streakColors[i * 6 + 2];
    }
    
    streakGeometry.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));
    streakGeometry.setAttribute('color', new THREE.BufferAttribute(streakColors, 3));
    
    const streakMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0
    });
    
    const streaks = new THREE.LineSegments(streakGeometry, streakMaterial);
    scene.add(streaks);
    streaksRef.current = { streaks, positions: streakPositions };

    // Animation variables
    let phase = 1;
    let elapsedTime = 0;
    let warpSpeed = 0;
    let tunnelRotationSpeed = 0;

    // GSAP Timeline for smooth transitions
    const tl = gsap.timeline();
    
    // Phase 1: Wormhole Expansion
    tl.to(tunnelMaterial, {
      opacity: 0.7,
      duration: PHASE_1_DURATION / 2
    });
    
    tl.to(particleMaterial, {
      opacity: 0.8,
      duration: PHASE_1_DURATION / 2
    }, "<");
    
    tl.to("#loading-text", {
      opacity: 1,
      duration: PHASE_1_DURATION / 4
    }, "<");
    
    // Phase 2: High-Speed Warp
    tl.to(streakMaterial, {
      opacity: 0.9,
      duration: PHASE_2_DURATION / 4
    }, `+=${PHASE_1_DURATION / 2}`);
    
    tl.to("#loading-text", {
      text: "WARP SPEED",
      duration: 0.1
    }, "<");
    
    tl.to(camera.position, {
      z: 0,
      duration: PHASE_2_DURATION,
      ease: "power2.in"
    }, "<");
    
    // Phase 3: Smooth Exit
    tl.to("#loading-text", {
      text: "ARRIVING",
      duration: 0.1
    }, `+=${PHASE_2_DURATION - PHASE_2_DURATION / 4}`);
    
    tl.to(tunnelMaterial, {
      opacity: 0,
      duration: PHASE_3_DURATION / 2
    }, `+=${PHASE_2_DURATION / 4}`);
    
    tl.to(particleMaterial, {
      opacity: 0,
      duration: PHASE_3_DURATION / 2
    }, "<");
    
    tl.to(streakMaterial, {
      opacity: 0,
      duration: PHASE_3_DURATION / 2
    }, "<");
    
    tl.to("#loading-text", {
      opacity: 0,
      duration: PHASE_3_DURATION / 4
    }, "<");
    
    tl.to("#preloader", {
      opacity: 0,
      duration: PHASE_3_DURATION / 2,
      onComplete: () => {
        document.getElementById('preloader').style.display = 'none';
        gsap.to("#nav", {
          opacity: 1,
          duration: 1.5
        });
      }
    }, `+=${PHASE_3_DURATION / 2}`);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      elapsedTime += 0.016; // Approx 60fps
      
      // Determine current phase based on elapsed time
      if (elapsedTime < PHASE_1_DURATION) {
        phase = 1;
        warpSpeed = elapsedTime / PHASE_1_DURATION;
        tunnelRotationSpeed = 0.001 + (warpSpeed * 0.003);
      } else if (elapsedTime < PHASE_1_DURATION + PHASE_2_DURATION) {
        phase = 2;
        warpSpeed = 1 + ((elapsedTime - PHASE_1_DURATION) / PHASE_2_DURATION) * 4;
        tunnelRotationSpeed = 0.004 + (warpSpeed * 0.005);
      } else {
        phase = 3;
        warpSpeed = Math.max(5 - ((elapsedTime - PHASE_1_DURATION - PHASE_2_DURATION) / PHASE_3_DURATION) * 5, 0);
        tunnelRotationSpeed = Math.max(0.03 - ((elapsedTime - PHASE_1_DURATION - PHASE_2_DURATION) / PHASE_3_DURATION) * 0.03, 0);
      }
      
      // Interactive tunnel distortion based on mouse movement
      if (tunnel) {
        tunnel.rotation.y += tunnelRotationSpeed;
        tunnel.rotation.z = mouseX * 0.05;
        tunnel.rotation.x = Math.PI / 2 + mouseY * 0.05;
      }
      
      // Update particle positions for gravitational effect
      const particlePositions = particleSystemRef.current.positions;
      const particleVelocities = particleSystemRef.current.velocities;
      
      for (let i = 0; i < particleCount; i++) {
        // Apply velocity
        particlePositions[i * 3] += particleVelocities[i].x;
        particlePositions[i * 3 + 1] += particleVelocities[i].y;
        particlePositions[i * 3 + 2] += particleVelocities[i].z * warpSpeed;
        
        // Reset particles that go too far
        if (particlePositions[i * 3 + 2] < -1000) {
          particlePositions[i * 3 + 2] = 500;
        }
        
        // Apply gravity effect towards center for particles in front
        if (particlePositions[i * 3 + 2] < camera.position.z) {
          const dx = particlePositions[i * 3];
          const dy = particlePositions[i * 3 + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 5) {
            particlePositions[i * 3] -= (dx / dist) * 0.2 * warpSpeed;
            particlePositions[i * 3 + 1] -= (dy / dist) * 0.2 * warpSpeed;
          }
        }
      }
      
      particleSystem.geometry.attributes.position.needsUpdate = true;
      
      // Update streak positions
      const streakPositions = streaksRef.current.positions;
      
      for (let i = 0; i < streakCount; i++) {
        // Move streaks towards camera based on warp speed
        streakPositions[i * 6 + 2] -= warpSpeed * 10;
        streakPositions[i * 6 + 5] -= warpSpeed * 10;
        
        // Reset streaks that go too far
        if (streakPositions[i * 6 + 2] < -300) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 20 + Math.random() * 100;
          const zPos = 400;
          const length = 20 + Math.random() * (30 * warpSpeed);
          
          streakPositions[i * 6] = Math.cos(angle) * radius;
          streakPositions[i * 6 + 1] = Math.sin(angle) * radius;
          streakPositions[i * 6 + 2] = zPos;
          
          streakPositions[i * 6 + 3] = Math.cos(angle) * radius;
          streakPositions[i * 6 + 4] = Math.sin(angle) * radius;
          streakPositions[i * 6 + 5] = zPos - length;
        }
        
        // Apply slight curve to streaks for more dynamic effect
        if (phase === 2) {
          streakPositions[i * 6] += (Math.random() - 0.5) * 0.5;
          streakPositions[i * 6 + 1] += (Math.random() - 0.5) * 0.5;
        }
      }
      
      streaks.geometry.attributes.position.needsUpdate = true;
      
      // Apply tunnel texture animation
      if (tunnelTexture) {
        tunnelTexture.offset.y -= 0.03 * warpSpeed;
      }
      
      // Camera effects based on phase
      if (phase === 2) {
        camera.fov = 75 + (warpSpeed * 5);
        camera.updateProjectionMatrix();
      }
      
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (scene) {
        scene.clear();
      }
    };
  }, []);

  return (
    <div id="preloader" className="loading-page">
      <canvas ref={canvasRef} id="loader-canvas"></canvas>
      <div className="loading-text" id="loading-text">ENTERING PORTAL</div>
    </div>
  );
};

export default LoadingPage;
