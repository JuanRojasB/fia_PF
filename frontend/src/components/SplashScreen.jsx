import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import orbLogo from '../assets/orb-logo.png';
import fiaLogo from '../assets/pollo_fiesta_FIA.png';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [logoPhase, setLogoPhase] = useState('orb'); // 'orb', 'exploding', 'fia'
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animación inicial del logo
    const logoTimer1 = setTimeout(() => setLogoPhase('exploding'), 1800);
    const logoTimer2 = setTimeout(() => setLogoPhase('fia'), 2700);
    const buttonTimer = setTimeout(() => setShowButton(true), 3200);

    return () => {
      clearTimeout(logoTimer1);
      clearTimeout(logoTimer2);
      clearTimeout(buttonTimer);
    };
  }, []);

  useEffect(() => {
    if (!started) return;

    // Reproducir sonido
    playSound();

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2; // Más suave - incrementos más pequeños
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return next;
      });
    }, 60); // Más frecuente - actualiza cada 60ms

    return () => {
      clearInterval(progressInterval);
    };
  }, [started, onComplete]);

  const playSound = () => {
    // DEEP SLAM - Más rápido y menos grave, estilo inicio de Windows
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
    audio.volume = 1.0;
    audio.playbackRate = 0.7; // Más rápido, menos grave
    audio.preservesPitch = true; // Mantiene el tono original
    audio.play().catch(err => console.log('Audio blocked:', err));
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Fondo amarillo inicial */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)'
        }}
        animate={{
          opacity: logoPhase === 'fia' ? 0 : 1
        }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      />
      
      {/* Fondo blanco que aparece gradualmente */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: logoPhase === 'fia' ? 1 : 0
        }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      />
      
      {!started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-50 flex flex-col items-center gap-8"
        >
          {/* Logo con animación de transformación */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Efecto de pantalla rompiéndose - grietas */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {/* Grietas principales */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    return (
                      <motion.div
                        key={`crack-${i}`}
                        className="absolute"
                        style={{
                          width: '3px',
                          height: '0px',
                          left: '50%',
                          top: '50%',
                          transformOrigin: 'top center',
                          rotate: `${angle}deg`,
                          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3), transparent)',
                          boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 15px rgba(56, 189, 248, 0.6)'
                        }}
                        initial={{ height: '0px', opacity: 0 }}
                        animate={{
                          height: ['0px', '180px', '200px'],
                          opacity: [0, 1, 0.7, 0],
                          width: ['3px', '2px', '1px']
                        }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.02,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      />
                    );
                  })}
                  
                  {/* Grietas secundarias ramificadas */}
                  {[...Array(24)].map((_, i) => {
                    const angle = (i * 360) / 24 + 15;
                    const length = 80 + (i % 3) * 30;
                    return (
                      <motion.div
                        key={`subcrack-${i}`}
                        className="absolute"
                        style={{
                          width: '2px',
                          height: '0px',
                          left: '50%',
                          top: '50%',
                          transformOrigin: 'top center',
                          rotate: `${angle}deg`,
                          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(147, 197, 253, 0.4), transparent)',
                          boxShadow: '0 0 5px rgba(56, 189, 248, 0.5)'
                        }}
                        initial={{ height: '0px', opacity: 0 }}
                        animate={{
                          height: [`0px`, `${length}px`],
                          opacity: [0, 0.8, 0.5, 0],
                          width: ['2px', '1px']
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.1 + i * 0.015,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      />
                    );
                  })}
                </>
              )}
            </AnimatePresence>

            {/* Anillos orbitales con efecto de fragmentación */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`ring-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: `${100 + i * 45}px`,
                        height: `${100 + i * 45}px`,
                        border: `4px solid rgba(255, 255, 255, ${0.95 - i * 0.12})`,
                        boxShadow: `0 0 30px rgba(255, 255, 255, ${0.7 - i * 0.1})`,
                        borderStyle: i % 2 === 0 ? 'solid' : 'dashed',
                        borderDasharray: i % 2 === 0 ? 'none' : '10 5'
                      }}
                      initial={{ 
                        scale: 0, 
                        opacity: 0,
                        rotate: 0
                      }}
                      animate={{ 
                        scale: [0, 1.4, 1.2, 1.5],
                        opacity: [0, 1, 0.8, 0],
                        rotate: i % 2 === 0 ? [0, 180, 360] : [0, -180, -360],
                        borderColor: [
                          `rgba(255, 255, 255, ${0.95 - i * 0.12})`,
                          `rgba(251, 191, 36, ${0.9 - i * 0.12})`,
                          `rgba(56, 189, 248, ${0.85 - i * 0.12})`,
                          `rgba(29, 78, 216, ${0.7 - i * 0.12})`
                        ],
                        boxShadow: [
                          `0 0 30px rgba(255, 255, 255, ${0.7 - i * 0.1})`,
                          `0 0 40px rgba(251, 191, 36, ${0.8 - i * 0.1})`,
                          `0 0 50px rgba(56, 189, 248, ${0.9 - i * 0.1})`,
                          `0 0 35px rgba(29, 78, 216, ${0.6 - i * 0.1})`
                        ]
                      }}
                      exit={{ opacity: 0, scale: 2, rotate: i % 2 === 0 ? 720 : -720 }}
                      transition={{
                        duration: 0.9,
                        delay: i * 0.03,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Fragmentos explosivos con múltiples formas y trayectorias */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {/* Fragmentos de vidrio grandes */}
                  {[...Array(60)].map((_, i) => {
                    const angle = (i * 360) / 60;
                    const distance = 140 + (i % 4) * 30;
                    const isSquare = i % 4 === 0;
                    const isTriangle = i % 5 === 0;
                    const size = 4 + (i % 4);
                    
                    return (
                      <motion.div
                        key={`fragment-${i}`}
                        className="absolute"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          left: '50%',
                          top: '50%',
                          marginLeft: `-${size/2}px`,
                          marginTop: `-${size/2}px`,
                          borderRadius: isSquare ? '0%' : (isTriangle ? '0%' : '50%'),
                          clipPath: isTriangle ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                        }}
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          opacity: 0, 
                          scale: 0,
                          rotate: 0,
                          background: 'radial-gradient(circle, rgba(255, 255, 255, 1), rgba(251, 191, 36, 0.9))'
                        }}
                        animate={{
                          x: [
                            0,
                            Math.cos(angle * Math.PI / 180) * (distance * 0.3),
                            Math.cos(angle * Math.PI / 180) * distance,
                            Math.cos((angle + 20) * Math.PI / 180) * (distance * 1.2)
                          ],
                          y: [
                            0,
                            Math.sin(angle * Math.PI / 180) * (distance * 0.3),
                            Math.sin(angle * Math.PI / 180) * distance,
                            Math.sin((angle + 20) * Math.PI / 180) * (distance * 1.2) + 30
                          ],
                          opacity: [0, 1, 0.95, 0.7, 0],
                          scale: [0, 2.5, 1.8, 2, 0],
                          rotate: [0, 180 * (i % 2 === 0 ? 1 : -1), 360 * (i % 2 === 0 ? 1 : -1), 540 * (i % 2 === 0 ? 1 : -1)],
                          background: [
                            'radial-gradient(circle, rgba(255, 255, 255, 1), rgba(251, 191, 36, 0.9))',
                            'radial-gradient(circle, rgba(255, 255, 255, 0.95), rgba(251, 191, 36, 0.8))',
                            'radial-gradient(circle, rgba(147, 197, 253, 1), rgba(96, 165, 250, 0.8))',
                            'radial-gradient(circle, rgba(56, 189, 248, 1), rgba(29, 78, 216, 0.7))',
                            'radial-gradient(circle, rgba(29, 78, 216, 0.8), rgba(30, 58, 138, 0.4))'
                          ]
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                          duration: 1.1,
                          delay: i * 0.005,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      />
                    );
                  })}
                </>
              )}
            </AnimatePresence>

            {/* Ondas expansivas múltiples con distorsión */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`wave-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: '80px',
                        height: '80px',
                        border: `${6 - i}px solid rgba(251, 191, 36, ${0.9 - i * 0.1})`
                      }}
                      initial={{ 
                        scale: 0, 
                        opacity: 1,
                        borderColor: 'rgba(251, 191, 36, 0.95)'
                      }}
                      animate={{
                        scale: [0, 2, 4.5, 5],
                        opacity: [1, 0.8, 0.3, 0],
                        borderColor: [
                          'rgba(251, 191, 36, 0.95)',
                          'rgba(255, 255, 255, 0.9)',
                          'rgba(147, 197, 253, 0.8)',
                          'rgba(56, 189, 248, 0.6)',
                          'rgba(29, 78, 216, 0.3)'
                        ],
                        borderWidth: [`${6 - i}px`, `${4 - i}px`, `${2}px`, '1px']
                      }}
                      transition={{
                        duration: 1.1,
                        delay: i * 0.06,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Rayos de luz dinámicos con pulsos */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`ray-${i}`}
                      className="absolute"
                      style={{
                        width: i % 2 === 0 ? '3px' : '2px',
                        height: '120px',
                        transformOrigin: 'center',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-1.5px',
                        marginTop: '-60px',
                        rotate: `${i * 30}deg`,
                        background: i % 2 === 0 
                          ? 'linear-gradient(to top, transparent, rgba(251, 191, 36, 0.9), rgba(255, 255, 255, 1), rgba(56, 189, 248, 0.9), transparent)'
                          : 'linear-gradient(to top, transparent, rgba(56, 189, 248, 0.8), rgba(147, 197, 253, 1), rgba(56, 189, 248, 0.8), transparent)'
                      }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{
                        opacity: [0, 1, 0.9, 0],
                        scaleY: [0, 1.5, 1.3, 0],
                        filter: [
                          'blur(0px)',
                          'blur(1px)',
                          'blur(2px)',
                          'blur(3px)'
                        ]
                      }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.025,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Logos - ambos centrados en la misma posición con crossfade suave */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence initial={false}>
                {logoPhase === 'orb' && (
                  <motion.div
                    key="orb-container"
                    className="absolute flex flex-col items-center justify-center gap-4"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1
                    }}
                    exit={{ 
                      opacity: 0,
                      scale: 1.05,
                      filter: 'brightness(2.5) blur(15px)'
                    }}
                    transition={{ 
                      duration: 0.8,
                      exit: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
                    }}
                  >
                    <motion.img
                      src={orbLogo}
                      alt="ORB Logo"
                      className="w-48 h-48 object-contain"
                      animate={{
                        filter: [
                          'brightness(1.1) drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))',
                          'brightness(1.3) drop-shadow(0 0 40px rgba(251, 191, 36, 0.9))',
                          'brightness(1.1) drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))'
                        ],
                        scale: [1, 1.03, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.h1
                      className="text-6xl font-black tracking-wider"
                      style={{
                        color: '#78350f',
                        textShadow: '0 3px 6px rgba(0, 0, 0, 0.6), 0 0 30px rgba(217, 119, 6, 0.8), 0 0 50px rgba(217, 119, 6, 0.5)',
                        letterSpacing: '0.15em'
                      }}
                      animate={{
                        textShadow: [
                          '0 3px 6px rgba(0, 0, 0, 0.6), 0 0 30px rgba(217, 119, 6, 0.8), 0 0 50px rgba(217, 119, 6, 0.5)',
                          '0 3px 6px rgba(0, 0, 0, 0.6), 0 0 40px rgba(217, 119, 6, 1), 0 0 70px rgba(217, 119, 6, 0.7)',
                          '0 3px 6px rgba(0, 0, 0, 0.6), 0 0 30px rgba(217, 119, 6, 0.8), 0 0 50px rgba(217, 119, 6, 0.5)'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      POLLO FIESTA
                    </motion.h1>
                  </motion.div>
                )}

                {(logoPhase === 'exploding' || logoPhase === 'fia') && (
                  <>
                    {logoPhase === 'exploding' && (
                      <>
                        {/* Flash central de explosión */}
                        <motion.div
                          key="explosion-flash"
                          className="absolute w-96 h-96 rounded-full"
                          initial={{ 
                            scale: 0, 
                            opacity: 1,
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(251, 191, 36, 0.9) 30%, rgba(251, 191, 36, 0.4) 60%, rgba(251, 191, 36, 0) 100%)'
                          }}
                          animate={{ 
                            scale: [0, 0.8, 2.2],
                            opacity: [1, 1, 0],
                            background: [
                              'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(251, 191, 36, 0.9) 30%, rgba(251, 191, 36, 0.4) 60%, rgba(251, 191, 36, 0) 100%)',
                              'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(147, 197, 253, 0.9) 30%, rgba(56, 189, 248, 0.5) 60%, rgba(56, 189, 248, 0) 100%)',
                              'radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(56, 189, 248, 0.5) 40%, rgba(56, 189, 248, 0) 100%)'
                            ]
                          }}
                          transition={{ 
                            duration: 0.8, 
                            ease: [0.22, 1, 0.36, 1]
                          }}
                        />
                        
                        {/* Anillo de impacto */}
                        <motion.div
                          key="explosion-ring"
                          className="absolute w-32 h-32 rounded-full"
                          style={{
                            border: '8px solid rgba(255, 255, 255, 1)',
                            boxShadow: '0 0 40px rgba(255, 255, 255, 1), inset 0 0 40px rgba(255, 255, 255, 0.5)'
                          }}
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ 
                            scale: [1, 1.5, 3],
                            opacity: [1, 0.8, 0],
                            borderWidth: ['8px', '6px', '2px'],
                            borderColor: [
                              'rgba(255, 255, 255, 1)',
                              'rgba(251, 191, 36, 0.9)',
                              'rgba(56, 189, 248, 0.6)'
                            ]
                          }}
                          transition={{ 
                            duration: 0.7, 
                            ease: [0.22, 1, 0.36, 1]
                          }}
                        />

                        {/* Distorsión espacial */}
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={`distortion-${i}`}
                            className="absolute rounded-full"
                            style={{
                              width: `${60 + i * 30}px`,
                              height: `${60 + i * 30}px`,
                              border: `2px solid rgba(255, 255, 255, ${0.6 - i * 0.1})`,
                              filter: 'blur(2px)'
                            }}
                            initial={{ scale: 1, opacity: 0 }}
                            animate={{
                              scale: [1, 1.2, 1.8, 2.5],
                              opacity: [0, 0.8, 0.4, 0],
                              rotate: i % 2 === 0 ? [0, 90, 180] : [0, -90, -180]
                            }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.05,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </>
                    )}

                    <motion.div
                      key="fia-container"
                      className="absolute flex items-center justify-center"
                      initial={{ 
                        opacity: 0,
                        scale: 0.5,
                        filter: 'brightness(5) blur(30px)'
                      }}
                      animate={{ 
                        opacity: logoPhase === 'fia' ? 1 : 0,
                        scale: logoPhase === 'fia' ? 1 : 0.5,
                        filter: logoPhase === 'fia' 
                          ? 'brightness(1.2) blur(0px) drop-shadow(0 0 40px rgba(56, 189, 248, 0.8))'
                          : 'brightness(5) blur(30px)'
                      }}
                      transition={{
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <motion.img
                        src={fiaLogo}
                        alt="FIA Logo"
                        className="w-48 h-48 object-contain"
                        animate={{
                          filter: logoPhase === 'fia' ? [
                            'brightness(1.2) drop-shadow(0 0 40px rgba(56, 189, 248, 0.8))',
                            'brightness(1.4) drop-shadow(0 0 60px rgba(56, 189, 248, 1))',
                            'brightness(1.2) drop-shadow(0 0 40px rgba(56, 189, 248, 0.8))'
                          ] : 'brightness(1.2) drop-shadow(0 0 40px rgba(56, 189, 248, 0.8))',
                          scale: logoPhase === 'fia' ? [1, 1.03, 1] : 1
                        }}
                        transition={{
                          duration: 2,
                          repeat: logoPhase === 'fia' ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Título FIA */}
          <AnimatePresence>
            {showButton && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                transition={{ duration: 0.6 }}
              >
                FIA
              </motion.h1>
            )}
          </AnimatePresence>

          {/* Botón de inicio */}
          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                onClick={() => setStarted(true)}
                className="px-12 py-4 rounded-full text-xl font-bold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
                  color: 'white',
                  boxShadow: '0 0 40px rgba(56, 189, 248, 0.6)',
                  border: '2px solid rgba(56, 189, 248, 0.8)'
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 0 60px rgba(56, 189, 248, 0.9)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                INICIAR SISTEMA
              </motion.button>
            )}
          </AnimatePresence>

          {/* Texto inferior */}
          <AnimatePresence>
            {showButton && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 text-sm font-mono"
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Presiona para comenzar
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {started && (
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-8">
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative mb-12 w-64 h-64 flex items-center justify-center"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${120 + i * 50}px`,
                  height: `${120 + i * 50}px`,
                  border: `2px solid rgba(56, 189, 248, ${0.5 - i * 0.15})`,
                }}
                animate={{
                  rotate: i % 2 === 0 ? 360 : -360,
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  rotate: { duration: 8 - i * 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            ))}

            <motion.div
              className="relative w-40 h-40 rounded-full flex items-center justify-center overflow-hidden z-10"
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3), rgba(0, 0, 0, 0.9))',
                border: '3px solid rgba(56, 189, 248, 0.8)',
                boxShadow: '0 0 60px rgba(56, 189, 248, 0.6)'
              }}
              animate={{
                boxShadow: [
                  '0 0 60px rgba(56, 189, 248, 0.6)',
                  '0 0 80px rgba(56, 189, 248, 0.8)',
                  '0 0 60px rgba(56, 189, 248, 0.6)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.img
                src={fiaLogo}
                alt="FIA Logo"
                className="absolute w-[130%] h-[130%] object-cover"
                style={{
                  filter: 'brightness(1.3) contrast(1.2)'
                }}
              />
            </motion.div>

            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-sky-400"
                style={{
                  boxShadow: '0 0 10px rgba(56, 189, 248, 1)',
                  left: '50%',
                  top: '50%'
                }}
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1
              className="text-7xl font-black mb-3"
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FIA
            </h1>
            
            <p
              className="text-sm text-gray-600 font-light uppercase tracking-widest"
              style={{
                letterSpacing: '0.3em',
              }}
            >
              FIESTA INTELLIGENCE ASSISTANT
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
                  width: `${progress}%`
                }}
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(56, 189, 248, 0.6)',
                    '0 0 25px rgba(56, 189, 248, 0.9)',
                    '0 0 15px rgba(56, 189, 248, 0.6)'
                  ]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Efecto de brillo que se mueve */}
              <motion.div
                className="absolute inset-y-0 left-0 w-20 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  width: '100px'
                }}
                animate={{
                  x: ['-100px', '400px']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600 font-mono">
              <span>CARGANDO</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
