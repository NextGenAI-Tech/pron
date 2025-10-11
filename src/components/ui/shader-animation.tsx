"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ShaderAnimation() {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uniforms: any;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Fragment shader
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec3 baseColor;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }
        
        float intensity = (color.r + color.g + color.b) / 3.0;
        vec3 tinted = baseColor * intensity;
        // Make background transparent; draw only lines with alpha proportional to intensity
        gl_FragColor = vec4(tinted, intensity);
      }
    `;

    // Initialize Three.js scene
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      baseColor: { value: new THREE.Color(1, 1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // fully transparent clear to avoid gray overlay

    container.appendChild(renderer.domElement);

    // Read shadcn primary color from CSS variable and set as baseColor
    const hslToRgb = (h: number, s: number, l: number) => {
      const s01 = s / 100;
      const l01 = l / 100;
      const c = (1 - Math.abs(2 * l01 - 1)) * s01;
      const hp = (h % 360) / 60;
      const x = c * (1 - Math.abs((hp % 2) - 1));
      let r1 = 0,
        g1 = 0,
        b1 = 0;
      if (0 <= hp && hp < 1) {
        r1 = c;
        g1 = x;
        b1 = 0;
      } else if (1 <= hp && hp < 2) {
        r1 = x;
        g1 = c;
        b1 = 0;
      } else if (2 <= hp && hp < 3) {
        r1 = 0;
        g1 = c;
        b1 = x;
      } else if (3 <= hp && hp < 4) {
        r1 = 0;
        g1 = x;
        b1 = c;
      } else if (4 <= hp && hp < 5) {
        r1 = x;
        g1 = 0;
        b1 = c;
      } else {
        r1 = c;
        g1 = 0;
        b1 = x;
      }
      const m = l01 - c / 2;
      return { r: r1 + m, g: g1 + m, b: b1 + m };
    };

    const applyPrimaryFromCSS = () => {
      const style = getComputedStyle(document.documentElement);
      const raw = style.getPropertyValue("--primary").trim();
      if (!raw) return;
      const parts = raw.replace(/%/g, "").split(/\s+/).filter(Boolean);
      if (parts.length < 3) return;
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      const l = parseFloat(parts[2]);
      const { r, g, b } = hslToRgb(h, s, l);
      (uniforms.baseColor.value as THREE.Color).setRGB(r, g, b);
    };

    applyPrimaryFromCSS();

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    // Initial resize
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full"
      style={{
        background: resolvedTheme === "dark" ? "#000" : "#fff",
        overflow: "hidden",
      }}
    />
  );
}
