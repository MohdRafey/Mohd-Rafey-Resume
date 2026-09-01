// src/components/PillSelector.jsx
import React, { useRef, useEffect, useCallback, useState } from 'react';

const MAX_RIPPLES = 16;
const TAB_WIDTH = 116; // Static column width
const DROPLET_WIDTH = 138; // 14px horizontal overhang per side
const DROPLET_HEIGHT = 52; // 7px vertical overhang above & below
const TRAY_PADDING = 4; // p-1 in Tailwind (4px)

const VS_SOURCE = `
  attribute vec2 aPos;
  void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

const FS_SOURCE = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec4 u_ripples[${MAX_RIPPLES}];

  float heightAt(vec2 p) {
    float h = 0.0;
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec4 r = u_ripples[i];
      float birth = r.z;
      if (birth <= 0.0) continue;

      float age = u_time - birth;
      if (age >= 0.0 && age <= 1.2) {
        float dist = distance(p, r.xy);
        float waveFront = age * 120.0;
        float ringDist = dist - waveFront;
        
        float envelope = exp(-age * 3.4) * exp(-(ringDist * ringDist) / (2.0 * 6.5 * 6.5));
        h += envelope * cos(ringDist * 0.55);
      }
    }
    return h;
  }

  void main() {
    vec2 p = gl_FragCoord.xy;
    float eps = 1.0;

    float hL = heightAt(p - vec2(eps, 0.0));
    float hR = heightAt(p + vec2(eps, 0.0));
    float hD = heightAt(p - vec2(0.0, eps));
    float hU = heightAt(p + vec2(0.0, eps));

    vec2 grad = vec2(hR - hL, hU - hD);
    vec3 normal = normalize(vec3(-grad.x * 2.8, -grad.y * 2.8, 1.0));
    vec3 lightDir = normalize(vec3(0.35, 0.65, 0.7));

    float diff = max(dot(normal, lightDir), 0.0);
    float spec = pow(diff, 28.0);
    float waveDistortion = length(grad);

    float alpha = clamp(spec * 0.85 + waveDistortion * 2.6, 0.0, 0.95);
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function PillSelector({
  items = [],
  activeId,
  onChange,
  isLight = false,
  enableRandomDrops = false,
  className = ''
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isShining, setIsShining] = useState(false);
  
  const ripplesRef = useRef(new Float32Array(MAX_RIPPLES * 4).fill(0.0));
  const rippleIdxRef = useRef(0);
  const startTimeRef = useRef(performance.now());
  const lastRipplePosRef = useRef({ x: 0, y: 0, time: 0 });

  // Calculate centered horizontal offset
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const dropletLeft = TRAY_PADDING + activeIndex * TAB_WIDTH - ((DROPLET_WIDTH - TAB_WIDTH) / 2);

  // Trigger brief iridescent chromatic sweep on tab switch in dark mode
  useEffect(() => {
    if (isLight) return;
    setIsShining(true);
    const timer = setTimeout(() => setIsShining(false), 900);
    return () => clearTimeout(timer);
  }, [activeId, isLight]);

  const addRipple = useCallback((x, y) => {
    const t = (performance.now() - startTimeRef.current) / 1000;
    const idx = rippleIdxRef.current;
    ripplesRef.current[idx * 4 + 0] = x;
    ripplesRef.current[idx * 4 + 1] = y;
    ripplesRef.current[idx * 4 + 2] = t;
    ripplesRef.current[idx * 4 + 3] = 1.0;
    rippleIdxRef.current = (idx + 1) % MAX_RIPPLES;
  }, []);

  // WebGL Context Setup for Light Mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLight) return;

    canvas.width = DROPLET_WIDTH;
    canvas.height = DROPLET_HEIGHT;

    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      antialias: true, 
      premultipliedAlpha: false 
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRipples = gl.getUniformLocation(program, 'u_ripples');

    let animFrameId;

    const render = () => {
      if (!canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - startTimeRef.current) / 1000);
      gl.uniform4fv(uRipples, ripplesRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(quadBuffer);
    };
  }, [isLight]);

  // Ambient Raindrops (Light mode only)
  useEffect(() => {
    if (!isLight || !enableRandomDrops) return;

    let timeoutId;
    let isMounted = true;

    const triggerRandom = () => {
      if (!isMounted) return;

      const canvas = canvasRef.current;
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        const rx = canvas.width * (0.2 + Math.random() * 0.6);
        const ry = canvas.height * (0.25 + Math.random() * 0.5);
        addRipple(rx, ry);
      }

      timeoutId = setTimeout(triggerRandom, 2200 + Math.random() * 1800);
    };

    timeoutId = setTimeout(triggerRandom, 600);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isLight, enableRandomDrops, addRipple, activeId]);

  // Hover wake for Light mode
  const handlePointerMove = (e) => {
    if (!isLight) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = canvas.height - (e.clientY - rect.top);

    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;

    const now = performance.now();
    const last = lastRipplePosRef.current;
    const dx = x - last.x;
    const dy = y - last.y;
    const distSq = dx * dx + dy * dy;

    if (distSq > 36 || now - last.time > 40) {
      addRipple(x, y);
      lastRipplePosRef.current = { x, y, time: now };
    }
  };

  // Button Click Handler
  const handleButtonClick = (item, e) => {
    onChange(item.id);

    const canvas = canvasRef.current;
    if (canvas && isLight) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickRatioX = (e.clientX - rect.left) / rect.width;
      const rx = canvas.width * Math.max(0.15, Math.min(0.85, isNaN(clickRatioX) ? 0.5 : clickRatioX));
      const ry = canvas.height * 0.5;

      addRipple(rx, ry);
      setTimeout(() => {
        addRipple(rx + (Math.random() * 12 - 6), ry + (Math.random() * 8 - 4));
      }, 80);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`ios-glass-panel relative inline-flex items-center p-1 rounded-full select-none transition-all duration-300 !overflow-visible z-20 group/pill ${className}`}
    >
      {/* 1. EXPANDED MOVING CAPSULE (Light Mode Droplet / Dark Mode Iridescent Glare) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-[54px] rounded-full pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.34,1.45,0.64,1)] z-10 overflow-hidden"
        style={{
          left: `${dropletLeft}px`,
          width: `${DROPLET_WIDTH}px`,
          background: isLight
            ? 'rgba(255, 255, 255, 0.12)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 40%, rgba(255, 255, 255, 0.08) 100%)',
          border: isLight
            ? '1.5px solid rgba(255, 255, 255, 0.95)'
            : '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: isLight
            ? '0 12px 28px -2px rgba(17, 22, 51, 0.16), 0 3px 8px -1px rgba(17, 22, 51, 0.08), inset 0 1px 1.5px rgba(255, 255, 255, 1), inset 0 -1px 1px rgba(255, 255, 255, 0.5)'
            : 'inset 0 1px 1.5px rgba(255, 255, 255, 0.45), inset -0.2em -0.2em 0.3em rgba(99, 102, 241, 0.2), inset -0.2em -0.5em 0.6em rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)'
        }}
      >
        {/* Light Mode: Dynamic Water Canvas */}
        {isLight && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block pointer-events-none"
          />
        )}

        {/* Dark Mode: Iridescent Internal Prismatic Flares & Specular Ring */}
        {!isLight && (
          <>
            {/* Prismatic color diffraction sweep */}
            <div
              className={`absolute inset-[-1px] rounded-full pointer-events-none transition-all duration-500 ease-out ${
                isShining ? 'opacity-85 translate-x-0 scale-100' : 'opacity-0 translate-x-5 scale-90 group-hover/pill:opacity-75 group-hover/pill:translate-x-0 group-hover/pill:scale-100'
              }`}
              style={{
                background: 'linear-gradient(98deg, rgba(244, 63, 94, 0.9) -5%, rgba(168, 85, 247, 0.9) 45%, rgba(56, 189, 248, 0.9) 110%)',
                WebkitMask: 'linear-gradient(166deg, transparent 40%, black)',
                mask: 'linear-gradient(166deg, transparent 40%, black)',
                filter: 'blur(4px) brightness(1.2) contrast(1.3)',
                boxShadow: 'inset 0 -1px 0 1px rgba(255, 255, 255, 0.3), inset 0 -0.2em 0.25em rgba(255, 255, 255, 0.5)',
                zIndex: 3
              }}
            />
            {/* Soft inner ambient light bleed */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                opacity: 0.3,
                boxShadow: 'inset 0 -0.2em 2px 1px rgba(255, 255, 255, 0.8), inset 0 -0.25em 0.35em rgba(165, 180, 252, 0.6), inset 0 -0.3em 0.75em rgba(99, 102, 241, 0.4)',
                mixBlendMode: 'screen',
                zIndex: 2
              }}
            />
          </>
        )}
      </div>

      {/* 2. PILL ITEM BUTTONS (32PX / H-8) */}
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            onClick={(e) => handleButtonClick(item, e)}
            type="button"
            className="relative z-20 flex-shrink-0 w-[116px] h-8 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 outline-none select-none bg-transparent border-none p-0"
          >
            <div
              className={`flex items-center justify-center gap-1.5 transform transition-transform duration-300 ease-out origin-center ${
                isActive ? 'scale-115' : 'scale-100'
              }`}
            >
              {item.icon && (
                <span
                  className={`text-xs inline-block transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  {item.icon}
                </span>
              )}

              <span
                className={`text-xs font-bold tracking-wider uppercase leading-none transition-colors duration-300 truncate max-w-[84px] text-center ${
                  isActive
                    ? isLight
                      ? 'font-black text-[#111633]'
                      : 'font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : isLight
                      ? 'font-semibold text-[#525875] hover:text-[#111633]'
                      : 'font-semibold text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}