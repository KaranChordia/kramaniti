'use client';
import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation referencing market data/network topology
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 20);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.fillStyle = isDark ? 'rgba(240, 240, 245, 0.4)' : 'rgba(10, 10, 15, 0.2)';
      ctx.strokeStyle = isDark ? 'rgba(201, 168, 76, 0.15)' : 'rgba(160, 125, 58, 0.15)'; // Gold connection lines

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = 1 - dist / 120;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className={styles.hero} id="hero">
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
      <div className={styles.ambientGlow}></div>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={`${styles.headline} animate-reveal`}>
            We architect intelligent media systems.
          </h1>
          <p className={`${styles.subheading} animate-reveal`} style={{ animationDelay: '100ms' }}>
            Bridging cinematic storytelling and autonomous AI infrastructure for modern enterprises.
          </p>
          
          <form className={`${styles.formGroup} animate-reveal`} style={{ animationDelay: '200ms' }} onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Your work email" 
              required 
              className={styles.emailInput}
            />
            <Button type="submit" variant="primary" className={styles.submitBtn}>
              Get the AI Audit Blueprint
            </Button>
          </form>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </section>
  );
}
