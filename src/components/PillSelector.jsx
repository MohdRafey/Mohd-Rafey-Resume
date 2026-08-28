import React, { useRef, useState, useEffect } from 'react';

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
      float age = u_time - r.z;
      float active = step(0.0, age) * step(age, 1.2);
      float ageC = clamp(age, 0.0, 1.2);

      float dist = distance(p, r.xy);
      float waveFront = ageC * 120.0;
      float ringDist = dist - waveFront;
      
      // Tightened envelope creates smooth liquid wake disturbance
      float envelope = exp(-ageC * 3.4) * exp(-(ringDist * ringDist) / (2.0 * 6.5 * 6.5));
      h += active * envelope * cos(ringDist * 0.55);
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

    // Alpha illuminates exclusively along the wake crests
    float alpha = clamp(spec * 0.85 + waveDistortion * 2.6, 0.0, 0.95);

    // Pure white specular highlights over fully clear transparent glass
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function PillSelector({ items = [], activeId, onChange, isLight = false }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const canvasRef = useRef(null);
  const webglCtrlRef = useRef(null);
  const lastRipplePosRef = useRef({ x: 0, y: 0, time: 0 });
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // 1. Calculate active selector position and synchronize internal canvas resolution
  useEffect(() => {
    const activeButton = buttonRefs.current[activeId];
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const horizontalBleed = 8;
      const targetWidth = Math.round(buttonRect.width + horizontalBleed * 2);

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left - horizontalBleed,
        width: targetWidth,
        opacity: 1
      });

      if (canvasRef.current) {
        canvasRef.current.width = targetWidth;
        canvasRef.current.height = Math.round(containerRect.height + 12);
      }
    }
  }, [activeId, items]);

  // 2. Initialize WebGL with true alpha blending
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLight) return;

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
    gl.useProgram(program);

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

    const ripples = new Float32Array(MAX_RIPPLES * 4);
    for (let i = 0; i < MAX_RIPPLES; i++) ripples[i * 4 + 2] = -100.0;

    const startTime = performance.now();
    let rippleIdx = 0;
    let animFrameId;

    const render = () => {
      if (!canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - startTime) / 1000);
      gl.uniform4fv(uRipples, ripples);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animFrameId = requestAnimationFrame(render);
    };
    render();

    webglCtrlRef.current = {
      addRipple: (x, y) => {
        const t = (performance.now() - startTime) / 1000;
        ripples[rippleIdx * 4 + 0] = x;
        ripples[rippleIdx * 4 + 1] = y;
        ripples[rippleIdx * 4 + 2] = t;
        ripples[rippleIdx * 4 + 3] = 0;
        rippleIdx = (rippleIdx + 1) % MAX_RIPPLES;
      }
    };

    return () => {
      cancelAnimationFrame(animFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(quadBuffer);
    };
  }, [isLight]);

  // 3. Hover squiggling listener (Pointer Move Wake Trail)
  const handlePointerMove = (e) => {
    if (!isLight) return;
    const canvas = canvasRef.current;
    const ctrl = webglCtrlRef.current;
    if (!canvas || !ctrl) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = canvas.height - (e.clientY - rect.top);

    // Only add ripples if the cursor is physically over the liquid indicator capsule
    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;

    const now = performance.now();
    const last = lastRipplePosRef.current;
    const dx = x - last.x;
    const dy = y - last.y;
    const distSq = dx * dx + dy * dy;

    // Minimum distance (6px) or minimum interval (40ms) between trail ripples
    if (distSq > 36 || now - last.time > 40) {
      ctrl.addRipple(x, y);
      lastRipplePosRef.current = { x, y, time: now };
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="ios-glass-panel relative inline-flex items-center p-1 rounded-full select-none transition-all duration-300 !overflow-visible z-20"
    >
      {/* 1. OUTWARD PROTRUDING LIQUID DROPLET (Transparent with Hover Wake) */}
      <div
        className="absolute -top-1.5 -bottom-1.5 rounded-full pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.34,1.45,0.64,1)] z-10 overflow-hidden"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          background: isLight
            ? 'rgba(255, 255, 255, 0.08)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: isLight
            ? '1.5px solid rgba(255, 255, 255, 0.80)'
            : '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: isLight
            ? '0 8px 24px -2px rgba(28, 41, 81, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9), inset 0 -1px 1px rgba(255, 255, 255, 0.4)'
            : '0 10px 28px -4px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)'
        }}
      >
        {isLight && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block pointer-events-none"
          />
        )}
      </div>

      {/* 2. PILL ITEM BUTTONS */}
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            ref={(el) => (buttonRefs.current[item.id] = el)}
            onClick={() => onChange(item.id)}
            type="button"
            className="relative z-20 flex items-center justify-center px-4 py-1.5 rounded-full cursor-pointer transition-all duration-300 outline-none select-none"
          >
            <div
              className={`flex items-center gap-2 transform transition-transform duration-300 ease-out origin-center ${
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
                className={`text-xs font-bold tracking-wider uppercase leading-none transition-colors duration-300 ${
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