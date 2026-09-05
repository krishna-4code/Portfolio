"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import StackIcon, { type IconName } from "tech-stack-icons";

type FloatingIcon = {
  name: IconName;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  xPct: number;
  yPct: number;
};

const ICONS: FloatingIcon[] = [
  { name: "react", size: 46, duration: 16, delay: 0, opacity: 0.22, xPct: 6.5, yPct: 7.5 },
  { name: "nextjs", size: 60, duration: 19, delay: 0.6, opacity: 0.16, xPct: 25, yPct: 6.5 },
  { name: "typescript", size: 40, duration: 14, delay: 0.2, opacity: 0.26, xPct: 93, yPct: 11 },
  { name: "firebase", size: 42, duration: 15, delay: 1.9, opacity: 0.16, xPct: 38, yPct: 16 },
  { name: "nodejs", size: 52, duration: 17, delay: 1.1, opacity: 0.2, xPct: 77, yPct: 20 },
  { name: "tailwindcss", size: 54, duration: 15.5, delay: 0.4, opacity: 0.18, xPct: 11.5, yPct: 25 },
  { name: "mongodb", size: 40, duration: 13, delay: 2.4, opacity: 0.18, xPct: 64, yPct: 29 },
  { name: "threejs", size: 44, duration: 13.5, delay: 0.9, opacity: 0.24, xPct: 95, yPct: 33 },
  { name: "framer", size: 48, duration: 18, delay: 1.6, opacity: 0.15, xPct: 20.5, yPct: 38 },
  { name: "expressjs", size: 40, duration: 14.5, delay: 2.2, opacity: 0.14, xPct: 44, yPct: 39 },
  { name: "js", size: 38, duration: 15, delay: 0.3, opacity: 0.28, xPct: 4.5, yPct: 43 },
  { name: "css3", size: 42, duration: 16.5, delay: 1.3, opacity: 0.2, xPct: 68, yPct: 47 },
  { name: "html5", size: 42, duration: 14, delay: 0.7, opacity: 0.2, xPct: 31, yPct: 49 },
  { name: "python", size: 50, duration: 17.5, delay: 0.5, opacity: 0.18, xPct: 93, yPct: 56 },
  { name: "tensorflow", size: 46, duration: 16, delay: 1.8, opacity: 0.2, xPct: 7.5, yPct: 62 },
  { name: "gemini", size: 48, duration: 18.5, delay: 0.2, opacity: 0.2, xPct: 48, yPct: 69 },
  { name: "postgresql", size: 44, duration: 15.5, delay: 0.8, opacity: 0.2, xPct: 80, yPct: 71 },
  { name: "socketio", size: 36, duration: 14, delay: 2.6, opacity: 0.18, xPct: 38, yPct: 76 },
  { name: "stripe", size: 48, duration: 17, delay: 1.4, opacity: 0.16, xPct: 13.5, yPct: 79 },
  { name: "docker", size: 40, duration: 13.5, delay: 0.1, opacity: 0.24, xPct: 94, yPct: 85 },
];

const RADIUS = 170;
const MAX_SHIFT = 110;

type Entry = {
  getCenter: () => { x: number; y: number };
  setX: (v: number) => void;
  setY: (v: number) => void;
};

function TechIcon({
  config,
  index,
  register,
}: {
  config: FloatingIcon;
  index: number;
  register: (index: number, entry: Entry | null) => void;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 150, damping: 20, mass: 0.5 });

  useEffect(() => {
    const entry: Entry = {
      getCenter: () => ({
        x: (config.xPct / 100) * window.innerWidth,
        y: (config.yPct / 100) * window.innerHeight,
      }),
      setX: (v) => mx.set(v),
      setY: (v) => my.set(v),
    };
    register(index, entry);
    return () => register(index, null);
  }, [index, config.xPct, config.yPct, mx, my, register]);

  return (
    <motion.div
      className="absolute"
      style={{
        top: `calc(${config.yPct}% - ${config.size / 2}px)`,
        left: `calc(${config.xPct}% - ${config.size / 2}px)`,
        width: config.size,
        height: config.size,
        opacity: config.opacity,
      }}
    >
      {/* Continuous slow drift */}
      <motion.div
        animate={{
          x: [0, 12, 0, -10, 0],
          y: [0, -8, 6, 0],
          rotate: [0, 4, -3, 0],
        }}
        transition={{
          duration: config.duration,
          delay: config.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Cursor repulsion, spring-smoothed back to rest */}
        <motion.div style={{ x: sx, y: sy }}>
          <div className="w-full h-full [filter:invert(0.14)_brightness(1.2)_saturate(1.15)]">
            <StackIcon name={config.name} variant="light" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function TechBackground() {
  const registryRef = useRef<Map<number, Entry>>(new Map());

  const register = useCallback((index: number, entry: Entry | null) => {
    if (entry) {
      registryRef.current.set(index, entry);
    } else {
      registryRef.current.delete(index);
    }
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const map = registryRef.current;
      if (map.size === 0) return;

      const mX = e.clientX;
      const mY = e.clientY;

      for (const entry of Array.from(map.values())) {
        const c = entry.getCenter();
        const dx = c.x - mX;
        const dy = c.y - mY;
        const dist = Math.hypot(dx, dy);

        if (dist < RADIUS && dist > 0.001) {
          const force = 1 - dist / RADIUS;
          const shift = force * MAX_SHIFT;
          entry.setX((dx / dist) * shift);
          entry.setY((dy / dist) * shift);
        } else {
          entry.setX(0);
          entry.setY(0);
        }
      }
    };

    const reset = () => {
      for (const entry of Array.from(registryRef.current.values())) {
        entry.setX(0);
        entry.setY(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {ICONS.map((icon, i) => (
        <TechIcon key={icon.name} config={icon} index={i} register={register} />
      ))}
    </div>
  );
}