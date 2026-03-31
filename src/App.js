// App.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ChevronDown } from "lucide-react";
import "./App.css";

const headline = "W E L C O M E I T Z  F I Z Z";

export default function App() {
  const containerRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse Position for Parallax and Cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth mouse values for parallax
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Cursor values (faster response)
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll progress for the entire page (for Hero)
  const { scrollYProgress: globalScroll } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scroll progress specifically for the horizontal section
  const { scrollYProgress: horizontalScroll } = useScroll({
    target: horizontalSectionRef,
    offset: ["start start", "end end"]
  });

  const smoothGlobal = useSpring(globalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothHorizontal = useSpring(horizontalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hero Transformations (tied to global scroll start)
  const heroOpacity = useTransform(smoothGlobal, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothGlobal, [0, 0.2], [1, 0.8]);
  const heroY = useTransform(smoothGlobal, [0, 0.2], [0, -100]);

  // Parallax offsets based on mouse
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 0, height: typeof window !== 'undefined' ? window.innerHeight : 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const parallaxX = useTransform(smoothMouseX, [0, windowSize.width || 1920], [-30, 30]);
  const parallaxY = useTransform(smoothMouseY, [0, windowSize.height || 1080], [-30, 30]);

  // Horizontal Movement (tied to its own section scroll)
  const xTranslate = useTransform(smoothHorizontal, [0, 1], ["0%", "-75%"]);

  const stats = [
    { value: "98%", label: "Customer Satisfaction" },
    { value: "250ms", label: "Average Response Time" },
    { value: "1.2M", label: "Active Users" },
    { value: "15+", label: "Global Regions" },
  ];

  const bgOpacity = useTransform(smoothGlobal, [0, 0.3], [0.2, 0]);
  const indicatorOpacity = useTransform(smoothGlobal, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className="app-container">
      <div className="noise" />

      <motion.div
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        className="custom-cursor-dot"
        animate={{ scale: isHovering ? 4 : 1 }}
      />
      <motion.div
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        className="custom-cursor-ring"
        animate={{ scale: isHovering ? 1.5 : 1 }}
      />

      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            style={{ 
              x: parallaxX, 
              y: parallaxY,
              opacity: bgOpacity
            }}
            className="hero-bg-blur"
          />

          <motion.div
            style={{ 
              opacity: heroOpacity,
              scale: heroScale,
              y: heroY
            }}
            className="hero-text-container"
          >
            <div 
              className="headline-container"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <h1 className="headline">
                {headline.split(" ").map((word, wordIdx) => (
                  <span key={wordIdx} className="headline-word">
                    {word.split("").map((char, charIdx) => (
                      <motion.span
                        key={charIdx}
                        initial={{ opacity: 0, y: 100, rotateX: -90 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ 
                          duration: 1, 
                          delay: (wordIdx * 5 + charIdx) * 0.05,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        whileHover={{ y: -10, color: "#f97316" }}
                        className="headline-char"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>

            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 1, 
                    delay: 1.5 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="stat-item"
                >
                  <div className="stat-line" />
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="scroll-indicator"
        >
          <span className="scroll-text">Scroll</span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="scroll-arrow"
          >
            <ChevronDown size={32} strokeWidth={3} />
          </motion.div>
        </motion.div>
      </section>

      <div className="spacer" />

      <section ref={horizontalSectionRef} className="horizontal-section">
        <div className="horizontal-sticky">
          <motion.div style={{ x: xTranslate }} className="horizontal-track">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i}
                className="card"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <span className="card-number">0{i}</span>
                <div>
                  <h3 className="card-title">Innovation {i}</h3>
                  <p className="card-description">
                    Redefining the digital landscape through experimental design and robust engineering. 
                    Every pixel tells a story of precision and purpose. We focus on creating 
                    immersive experiences that resonate with users.
                  </p>
                </div>
              </motion.div>
            ))}
            <div className="card-spacer" />
          </motion.div>
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="cta-content"
        >
          <h2 className="cta-title">LET'S BUILD.</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="cta-button"
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </section>

      <footer className="footer">
        <p className="footer-text">ITZFIZZ PREMIUM EXPERIENCE</p>
      </footer>
    </div>
  );
}