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
    // Animación inicial del logo - más rápida y suave
    const logoTimer1 = setTimeout(() => setLogoPhase('exploding'), 1500);
    const logoTimer2 = setTimeout(() => setLogoPhase('fia'), 2000);
    const buttonTimer = setTimeout(() => setShowButton(true), 2400);

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
            {/* Efecto de pantalla rompiéndose - grietas simplificadas */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {/* Grietas principales - reducidas de 12 a 8 */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 360) / 8;
                    return (
                      <motion.div
                        key={`crack-${i}`}
                        className="absolute"
                        style={{
                          width: '2px',
                          height: '0px',
                          left: '50%',
                          top: '50%',
                          transformOrigin: 'top center',
                          rotate: `${angle}deg`,
                          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(56, 189, 248, 0.4), transparent)',
                          boxShadow: '0 0 6px rgba(56, 189, 248, 0.5)'
                        }}
                        initial={{ height: '0px', opacity: 0 }}
                        animate={{
                          height: ['0px', '150px'],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 0.4,
                          delay: i * 0.02,
                          ease: "easeOut"
                        }}
                      />
                    );
                  })}
                </>
              )}
            </AnimatePresence>

            {/* Anillos orbitales simplificados */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`ring-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: `${120 + i * 50}px`,
                        height: `${120 + i * 50}px`,
                        border: `3px solid rgba(56, 189, 248, ${0.8 - i * 0.2})`,
                        boxShadow: `0 0 20px rgba(56, 189, 248, ${0.6 - i * 0.15})`
                      }}
                      initial={{ 
                        scale: 0, 
                        opacity: 0
                      }}
                      animate={{ 
                        scale: [0, 1.2, 1.4],
                        opacity: [0, 0.8, 0]
                      }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.05,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Fragmentos explosivos simplificados */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {/* Fragmentos reducidos de 60 a 20 */}
                  {[...Array(20)].map((_, i) => {
                    const angle = (i * 360) / 20;
                    const distance = 120 + (i % 3) * 20;
                    const size = 3 + (i % 3);
                    
                    return (
                      <motion.div
                        key={`fragment-${i}`}
                        className="absolute rounded-full"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          left: '50%',
                          top: '50%',
                          marginLeft: `-${size/2}px`,
                          marginTop: `-${size/2}px`,
                          background: 'radial-gradient(circle, rgba(56, 189, 248, 1), rgba(29, 78, 216, 0.7))'
                        }}
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          opacity: 0, 
                          scale: 0
                        }}
                        animate={{
                          x: Math.cos(angle * Math.PI / 180) * distance,
                          y: Math.sin(angle * Math.PI / 180) * distance,
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.01,
                          ease: "easeOut"
                        }}
                      />
                    );
                  })}
                </>
              )}
            </AnimatePresence>

            {/* Ondas expansivas simplificadas */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`wave-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: '80px',
                        height: '80px',
                        border: `${4 - i}px solid rgba(56, 189, 248, ${0.8 - i * 0.2})`
                      }}
                      initial={{ 
                        scale: 0, 
                        opacity: 1
                      }}
                      animate={{
                        scale: [0, 3],
                        opacity: [1, 0],
                        borderWidth: [`${4 - i}px`, '1px']
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Rayos de luz simplificados */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`ray-${i}`}
                      className="absolute"
                      style={{
                        width: '2px',
                        height: '100px',
                        transformOrigin: 'center',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-1px',
                        marginTop: '-50px',
                        rotate: `${i * 45}deg`,
                        background: 'linear-gradient(to top, transparent, rgba(56, 189, 248, 0.8), rgba(255, 255, 255, 0.9), rgba(56, 189, 248, 0.8), transparent)'
                      }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scaleY: [0, 1.2, 0]
                      }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.03,
                        ease: "easeOut"
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
                        {/* Flash central simplificado */}
                        <motion.div
                          key="explosion-flash"
                          className="absolute w-64 h-64 rounded-full"
                          initial={{ 
                            scale: 0, 
                            opacity: 1,
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(56, 189, 248, 0.8) 50%, transparent 100%)'
                          }}
                          animate={{ 
                            scale: [0, 1.5],
                            opacity: [1, 0]
                          }}
                          transition={{ 
                            duration: 0.5, 
                            ease: "easeOut"
                          }}
                        />
                        
                        {/* Anillo de impacto simplificado */}
                        <motion.div
                          key="explosion-ring"
                          className="absolute w-32 h-32 rounded-full"
                          style={{
                            border: '6px solid rgba(56, 189, 248, 1)',
                            boxShadow: '0 0 30px rgba(56, 189, 248, 0.8)'
                          }}
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ 
                            scale: [1, 2.5],
                            opacity: [1, 0],
                            borderWidth: ['6px', '2px']
                          }}
                          transition={{ 
                            duration: 0.5, 
                            ease: "easeOut"
                          }}
                        />
                      </>
                    )}

                    <motion.div
                      key="fia-container"
                      className="absolute flex items-center justify-center"
                      initial={{ 
                        opacity: 0,
                        scale: 0.7,
                        filter: 'brightness(3) blur(10px)'
                      }}
                      animate={{ 
                        opacity: logoPhase === 'fia' ? 1 : 0,
                        scale: logoPhase === 'fia' ? 1 : 0.7,
                        filter: logoPhase === 'fia' 
                          ? 'brightness(1.1) blur(0px) drop-shadow(0 0 30px rgba(56, 189, 248, 0.6))'
                          : 'brightness(3) blur(10px)'
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                    >
                      <motion.img
                        src={fiaLogo}
                        alt="FIA Logo"
                        className="w-48 h-48 object-contain"
                        animate={{
                          filter: logoPhase === 'fia' ? [
                            'brightness(1.1) drop-shadow(0 0 30px rgba(56, 189, 248, 0.6))',
                            'brightness(1.2) drop-shadow(0 0 40px rgba(56, 189, 248, 0.8))',
                            'brightness(1.1) drop-shadow(0 0 30px rgba(56, 189, 248, 0.6))'
                          ] : 'brightness(1.1) drop-shadow(0 0 30px rgba(56, 189, 248, 0.6))'
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

          {/* Título FIA y subtítulo */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h1
                  className="text-6xl font-black mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1d4ed8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  FIA
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Fiesta Intelligence Assistant
                </p>
              </motion.div>
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
