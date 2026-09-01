// src/components/LiquidDropletButton.jsx
import React, { useRef, useEffect, useCallback } from 'react';

const MAX_RIPPLES = 16;

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

export default function LiquidDropletButton({
  children,
  onClick,
  isLight = true,
  enableRandomDrops = false,
  className = '',
  style = {},
  ...props
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ripplesRef = useRef(new Float32Array(MAX_RIPPLES * 4).fill(0.0));
  const rippleIdxRef = useRef(0);
  const startTimeRef = useRef(performance.now());
  const lastRipplePosRef = useRef({ x: 0, y: 0, time: 0 });

  const addRipple = useCallback((x, y) => {
    const t = (performance.now() - startTimeRef.current) / 1000;
    const idx = rippleIdxRef.current;
    ripplesRef.current[idx * 4 + 0] = x;
    ripplesRef.current[idx * 4 + 1] = y;
    ripplesRef.current[idx * 4 + 2] = t;
    ripplesRef.current[idx * 4 + 3] = 1.0;
    rippleIdxRef.current = (idx + 1) % MAX_RIPPLES;
  }, []);

  // Sync canvas buffer size reliably across dynamic theme switches & resizes
  useEffect(() => {
    if (!isLight) return;

    const syncCanvasSize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvasRef.current.width = Math.round(rect.width);
          canvasRef.current.height = Math.round(rect.height);
        }
      }
    };

    syncCanvasSize();
    const frameId = requestAnimationFrame(syncCanvasSize);
    window.addEventListener('resize', syncCanvasSize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', syncCanvasSize);
    };
  }, [isLight]);

  // WebGL Context setup
  useEffect(() => {
    if (!isLight) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!canvas.width || canvas.width < 10) canvas.width = 240;
    if (!canvas.height || canvas.height < 10) canvas.height = 60;

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

  // Ambient Drop Generator (Light mode only)
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
  }, [isLight, enableRandomDrops, addRipple]);

  const handlePointerMove = (e) => {
    if (!isLight || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((rect.bottom - e.clientY) / rect.height) * canvas.height;

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

  const handleClick = (e) => {
    if (isLight && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((rect.bottom - e.clientY) / rect.height) * canvas.height;

      addRipple(x, y);
      setTimeout(() => {
        addRipple(x + (Math.random() * 12 - 6), y + (Math.random() * 8 - 4));
      }, 80);
    }
    if (onClick) onClick(e);
  };

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={`relative inline-flex items-center justify-center rounded-full select-none cursor-pointer transition-transform duration-300 overflow-hidden ${className}`}
      style={{
        background: isLight
          ? 'rgba(255, 255, 255, 0.08)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
        border: isLight
          ? '1.5px solid rgba(255, 255, 255, 0.85)'
          : '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: isLight
          ? '0 8px 24px -2px rgba(28, 41, 81, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 1px rgba(255, 255, 255, 0.4)'
          : '0 10px 28px -4px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        ...style
      }}
      {...props}
    >
      {isLight && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />
      )}

      <div 
        className="relative z-10 flex items-center justify-center pointer-events-none transition-colors duration-300 font-bold"
        style={{
          color: isLight ? '#111633' : '#ffffff',
          WebkitTextFillColor: isLight ? '#111633' : '#ffffff',
          textShadow: 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
}