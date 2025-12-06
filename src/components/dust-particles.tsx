'use client';

import { useEffect, useState } from 'react';

const NUM_PARTICLES = 50;

type Particle = {
  id: number;
  style: React.CSSProperties;
};

const DustParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generatedParticles: Particle[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * -35;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;

      generatedParticles.push({
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
          animation: `dust-particles-drift ${duration}s ${delay}s linear infinite`,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
        } as React.CSSProperties,
      });
    }
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent/30"
          style={particle.style}
        />
      ))}
    </div>
  );
};

export default DustParticles;
