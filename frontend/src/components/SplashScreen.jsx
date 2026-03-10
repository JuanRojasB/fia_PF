import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import orbLogo from '../assets/orb-logo.png';
import fiaLogo from '../assets/pollo_fiesta_FIA.png';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [logoPhase, setLogoPhase] = useState('orb'); // 'orb', 'exploding', 'fia'
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animación inicial del logo - más tiempo para el logo ORB
    const logoTimer1 = setTimeout(() => setLogoPhase('exploding'), 2000);
    const logoTimer2 = setTimeout(() => setLogoPhase('fia'), 2900);
    const buttonTimer = setTimeout(() => setShowButton(true), 3400);

    return () => {
      clearTimeout(logoTimer1);
      clearTimeout(logoTimer2);
      clearTimeout(buttonTimer);
    };
  }, []);

  useEffect(() => {
    if (!started) return;

    // Reproducir sonido después de la interacción del usuario
    playSound();

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 3.33;
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [started, onComplete]);

  const playSound = async () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      setAudioContext(ctx);
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      const now = ctx.currentTime;
      
      // Impacto inicial más suave
      const impact = ctx.createOscillator();
      const impactGain = ctx.createGain();
      
      impact.type = 'sine';
      impact.frequency.setValueAtTime(120, now);
      impact.frequency.exponentialRampToValueAtTime(60, now + 0.12);
      
      impactGain.gain.setValueAtTime(0.3, now);
      impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      impact.connect(impactGain);
      impactGain.connect(ctx.destination);
      impact.start(now);
      impact.stop(now + 0.12);
      
      // Acorde limpio y balanceado
      const chord = [
        { freq: 261.63, gain: 0.2 },   // C4
        { freq: 329.63, gain: 0.22 },  // E4
        { freq: 392.00, gain: 0.2 },   // G4
        { freq: 523.25, gain: 0.18 }   // C5
      ];
      
      chord.forEach(({ freq, gain: gainValue }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gainNode.gain.setValueAtTime(0, now + 0.08);
        gainNode.gain.linearRampToValueAtTime(gainValue, now + 0.15);
        gainNode.gain.setValueAtTime(gainValue, now + 1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now + 0.08);
        osc.stop(now + 1.8);
      });
      
      // Sub-bass más controlado
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      
      bass.type = 'sine';
      bass.frequency.value = 65.41; // C2
      
      bassGain.gain.setValueAtTime(0, now + 0.08);
      bassGain.gain.linearRampToValueAtTime(0.28, now + 0.2);
      bassGain.gain.setValueAtTime(0.28, now + 1);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.start(now + 0.08);
      bass.stop(now + 1.8);
      
      // Brillo más suave
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(1046.50, now + 0.25);
      shimmer.frequency.exponentialRampToValueAtTime(1568.00, now + 1);
      
      shimmerGain.gain.setValueAtTime(0, now + 0.25);
      shimmerGain.gain.linearRampToValueAtTime(0.15, now + 0.32);
      shimmerGain.gain.setValueAtTime(0.15, now + 0.8);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      shimmer.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);
      shimmer.start(now + 0.25);
      shimmer.stop(now + 1.5);
      
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
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
      
      {/* Fondo azul que aparece gradualmente */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black"
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
            {/* Anillos orbitales que aparecen durante la explosión */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`ring-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: `${100 + i * 40}px`,
                        height: `${100 + i * 40}px`,
                        border: `3px solid rgba(255, 255, 255, ${0.9 - i * 0.15})`,
                        boxShadow: `0 0 20px rgba(255, 255, 255, ${0.6 - i * 0.1})`
                      }}
                      initial={{ 
                        scale: 0, 
                        opacity: 0
                      }}
                      animate={{ 
                        scale: [0, 1.3, 1.1],
                        opacity: [0, 1, 0.7],
                        borderColor: [
                          `rgba(255, 255, 255, ${0.9 - i * 0.15})`,
                          `rgba(56, 189, 248, ${0.9 - i * 0.15})`
                        ],
                        boxShadow: [
                          `0 0 20px rgba(255, 255, 255, ${0.6 - i * 0.1})`,
                          `0 0 25px rgba(56, 189, 248, ${0.8 - i * 0.1})`
                        ]
                      }}
                      exit={{ opacity: 0, scale: 1.4 }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.04,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Partículas explosivas con transición de color */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(28)].map((_, i) => {
                    const angle = (i * 360) / 28;
                    const distance = 160 + (i % 2) * 15;
                    return (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full"
                        style={{
                          width: `${2 + (i % 2)}px`,
                          height: `${2 + (i % 2)}px`,
                          left: '50%',
                          top: '50%',
                          marginLeft: '-2px',
                          marginTop: '-2px',
                        }}
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          opacity: 0, 
                          scale: 0,
                          background: 'radial-gradient(circle, rgba(251, 191, 36, 1), rgba(245, 158, 11, 0.5))'
                        }}
                        animate={{
                          x: Math.cos(angle * Math.PI / 180) * distance,
                          y: Math.sin(angle * Math.PI / 180) * distance,
                          opacity: [0, 1, 0.7, 0],
                          scale: [0, 1.8, 1.2, 0],
                          background: [
                            'radial-gradient(circle, rgba(251, 191, 36, 1), rgba(245, 158, 11, 0.5))',
                            'radial-gradient(circle, rgba(147, 197, 253, 1), rgba(96, 165, 250, 0.5))',
                            'radial-gradient(circle, rgba(56, 189, 248, 1), rgba(29, 78, 216, 0.5))'
                          ]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.008,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      />
                    );
                  })}
                </>
              )}
            </AnimatePresence>

            {/* Ondas expansivas con transición de color */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`wave-${i}`}
                      className="absolute rounded-full border-4"
                      style={{
                        width: '90px',
                        height: '90px',
                      }}
                      initial={{ 
                        scale: 0, 
                        opacity: 1,
                        borderColor: 'rgba(251, 191, 36, 0.9)'
                      }}
                      animate={{
                        scale: 4,
                        opacity: 0,
                        borderColor: 'rgba(56, 189, 248, 0.9)'
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.08,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Rayos de luz sutiles */}
            <AnimatePresence>
              {logoPhase === 'exploding' && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`ray-${i}`}
                      className="absolute bg-gradient-to-t from-transparent via-sky-400 to-transparent"
                      style={{
                        width: '2px',
                        height: '100px',
                        transformOrigin: 'center',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-1px',
                        marginTop: '-50px',
                        rotate: `${i * 60}deg`,
                      }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scaleY: [0, 1.2, 0]
                      }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.04,
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
                        <motion.div
                          key="explosion-flash"
                          className="absolute w-80 h-80 rounded-full"
                          initial={{ 
                            scale: 0, 
                            opacity: 1,
                            background: 'radial-gradient(circle, rgba(251, 191, 36, 1) 0%, rgba(251, 191, 36, 0.6) 40%, rgba(251, 191, 36, 0) 100%)'
                          }}
                          animate={{ 
                            scale: 1.8, 
                            opacity: 0,
                            background: 'radial-gradient(circle, rgba(56, 189, 248, 1) 0%, rgba(56, 189, 248, 0.6) 40%, rgba(56, 189, 248, 0) 100%)'
                          }}
                          transition={{ 
                            duration: 0.7, 
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                        />
                        <motion.div
                          key="explosion-ring"
                          className="absolute w-40 h-40 rounded-full border-6"
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.9)'
                          }}
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ 
                            scale: 2.5,
                            opacity: 0,
                            borderWidth: '2px'
                          }}
                          transition={{ 
                            duration: 0.6, 
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
                        filter: 'brightness(3) blur(20px)'
                      }}
                      animate={{ 
                        opacity: logoPhase === 'fia' ? 1 : 0,
                        scale: logoPhase === 'fia' ? 1 : 0.7,
                        filter: logoPhase === 'fia' 
                          ? 'brightness(1.2) blur(0px) drop-shadow(0 0 40px rgba(56, 189, 248, 0.8))'
                          : 'brightness(3) blur(20px)'
                      }}
                      transition={{
                        duration: 0.9,
                        ease: [0.4, 0, 0.2, 1]
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
                  background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #1d4ed8 100%)',
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
                className="text-gray-400 text-sm font-mono"
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
                background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FIA
            </h1>
            
            <p
              className="text-sm text-gray-300 font-light uppercase tracking-widest"
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
            <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #38bdf8, #1d4ed8)',
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
                  width: `${progress}%`
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
              <span>CARGANDO</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
