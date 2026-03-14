import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import orbLogo from '../assets/orb-logo.png';
import fiaLogo from '../assets/pollo_fiesta_FIA.png';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [logoPhase, setLogoPhase] = useState('initial');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setLogoPhase('anticipation'), 2000);
    const timer2 = setTimeout(() => setLogoPhase('flipping'), 2400);
    const timer3 = setTimeout(() => setLogoPhase('landing'), 3000);
    const timer4 = setTimeout(() => setLogoPhase('final'), 3300);
    const timer5 = setTimeout(() => setShowButton(true), 3800);
    return () => {
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3);
      clearTimeout(timer4); clearTimeout(timer5);
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
    audio.volume = 1.0; audio.playbackRate = 0.7; audio.preservesPitch = true;
    audio.play().catch(() => {});
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        if (next >= 100) { clearInterval(interval); setTimeout(() => onComplete(), 300); return 100; }
        return next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [started, onComplete]);

  const isYellow = logoPhase === 'initial' || logoPhase === 'anticipation';
  const isBlue = logoPhase === 'landing' || logoPhase === 'final';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence mode="wait">

      {/* ── FONDO AMARILLO ── */}
      <motion.div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)' }}
        animate={{ opacity: isYellow ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* ── FONDO AZUL/BLANCO ── */}
      <motion.div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isBlue || logoPhase === 'flipping' ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* ── PATRÓN DE PUNTOS (fondo) ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: isYellow
          ? 'radial-gradient(circle, rgba(180,120,0,0.15) 1px, transparent 1px)'
          : 'radial-gradient(circle, rgba(56,189,248,0.12) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.8
      }} />

      {!started && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* ── RAYOS DE LUZ DESDE EL LOGO (fase inicial) ── */}
          <AnimatePresence>
            {isYellow && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center"
                style={{ marginTop: '-190px' }}>
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 360) / 12;
                  return (
                    <motion.div key={i}
                      className="absolute"
                      style={{
                        width: '3px',
                        height: '55vw',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-1.5px',
                        transformOrigin: 'top center',
                        rotate: `${angle}deg`,
                        background: 'linear-gradient(to bottom, rgba(251,191,36,0.7) 0%, rgba(251,191,36,0.2) 40%, transparent 100%)',
                      }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: [0, 0.6, 0.4], scaleY: [0, 1, 1] }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                    />
                  );
                })}
              </div>
            )}
          </AnimatePresence>



          {/* ── FLASH DE PANTALLA COMPLETA al girar ── */}
          <AnimatePresence>
            {logoPhase === 'flipping' && (
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: 'white', zIndex: 20 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          {/* ── ONDAS DE CHOQUE PANTALLA COMPLETA ── */}
          <AnimatePresence>
            {logoPhase === 'flipping' && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      top: '50%', left: '50%',
                      width: '200px', height: '200px',
                      marginTop: '-160px', marginLeft: '-100px',
                      border: `${4 - i}px solid rgba(56,189,248,${0.8 - i * 0.15})`,
                      boxShadow: `0 0 30px rgba(56,189,248,${0.5 - i * 0.1})`,
                      zIndex: 15
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [0, 8], opacity: [1, 0] }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>



          {/* ── CONTENEDOR FLEX: logo + texto centrados juntos ── */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0px',
            zIndex: 30,
            pointerEvents: 'none'
          }}>
          {/* ── MONEDA 3D ── */}
          <div style={{
            width: '380px', height: '380px',
            perspective: '1500px',
            flexShrink: 0,
            pointerEvents: 'auto'
          }}>
            {/* Flash local al girar */}
            <AnimatePresence>
              {logoPhase === 'flipping' && (
                <motion.div className="absolute rounded-full pointer-events-none"
                  style={{
                    width: '450px', height: '450px',
                    top: '50%', left: '50%',
                    marginTop: '-225px', marginLeft: '-225px',
                    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(56,189,248,0.6) 40%, transparent 70%)',
                    zIndex: 10
                  }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.3, 1.3, 2] }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            {/* Partículas al aterrizar */}
            <AnimatePresence>
              {logoPhase === 'landing' && (
                [...Array(20)].map((_, i) => {
                  const angle = (i * 360) / 20;
                  const dist = 100 + (i % 3) * 20;
                  const size = 4 + (i % 3) * 2;
                  return (
                    <motion.div key={i} className="absolute rounded-full pointer-events-none"
                      style={{
                        width: size, height: size,
                        top: '50%', left: '50%',
                        marginTop: -size / 2, marginLeft: -size / 2,
                        background: 'rgba(56,189,248,1)',
                        boxShadow: '0 0 8px rgba(56,189,248,0.9)',
                        zIndex: 10
                      }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      animate={{
                        x: Math.cos(angle * Math.PI / 180) * dist,
                        y: Math.sin(angle * Math.PI / 180) * dist,
                        opacity: [0, 1, 0], scale: [0, 1.5, 0]
                      }}
                      transition={{ duration: 0.6, delay: i * 0.015, ease: "easeOut" }}
                    />
                  );
                })
              )}
            </AnimatePresence>

            {/* Moneda - solo rotación Y */}
            <motion.div
              style={{
                width: '100%', height: '100%',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}
              animate={{
                rotateY: logoPhase === 'flipping' || logoPhase === 'landing' || logoPhase === 'final' ? 180 : 0
              }}
              transition={{ duration: 0.6, ease: [0.45, 0, 0.55, 1] }}
            >
              {/* Cara frontal - ORB */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  width: '325px', height: '325px', borderRadius: '50%', position: 'absolute',
                  background: 'radial-gradient(circle, #fde047, #eab308)',
                  boxShadow: '0 4px 20px rgba(234,179,8,0.4)',
                  opacity: 0.5
                }} />
                <img src={orbLogo} alt="ORB" style={{
                  width: '360px', height: '360px', objectFit: 'contain',
                  filter: 'brightness(1.15) drop-shadow(0 0 18px rgba(251,191,36,0.6))',
                  position: 'relative'
                }} />
              </div>

              {/* Cara trasera - FIA */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  width: '325px', height: '325px', borderRadius: '50%', position: 'absolute',
                  background: 'radial-gradient(circle, #7dd3fc, #38bdf8)',
                  boxShadow: '0 4px 20px rgba(56,189,248,0.4)',
                  opacity: 0.5
                }} />
                <img src={fiaLogo} alt="FIA" style={{
                  width: '360px', height: '360px', objectFit: 'contain',
                  filter: 'brightness(1.1) drop-shadow(0 0 18px rgba(56,189,248,0.6))',
                  position: 'relative'
                }} />
              </div>
            </motion.div>
          </div>

          {/* ── TEXTO debajo del logo ── */}
          <div style={{
            textAlign: 'center',
            pointerEvents: 'auto',
            marginTop: '-20px'
          }}>
            <AnimatePresence>
              {isYellow && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  {['POLLO', 'FIESTA'].map((word, wi) => (
                    <div key={word} style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                      {word.split('').map((letter, li) => (
                        <motion.span key={li}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: wi * 0.15 + li * 0.05 }}
                          style={{
                            fontSize: '5.5rem', fontWeight: 900, lineHeight: 1,
                            color: '#78350f', letterSpacing: '0.05em',
                            textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 0 30px rgba(217,119,6,0.8)',
                            display: 'inline-block'
                          }}
                        >{letter}</motion.span>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── TEXTO FIA + BOTÓN ── */}
            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    style={{
                      fontSize: '3.5rem', fontWeight: 900, marginBottom: '4px',
                      background: 'linear-gradient(135deg, #1e293b, #3b82f6, #1d4ed8)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}
                  >FIA</motion.h1>
                  <p style={{ color: '#4b5563', fontSize: '1rem', fontWeight: 500, marginBottom: '24px' }}>
                    Fiesta Intelligence Assistant
                  </p>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setStarted(true)}
                    whileHover={{ scale: 1.08, boxShadow: '0 0 50px rgba(56,189,248,0.8)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    style={{
                      padding: '14px 48px', borderRadius: '9999px',
                      fontSize: '1.1rem', fontWeight: 700, color: 'white', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
                      boxShadow: '0 0 30px rgba(56,189,248,0.5)',
                      border: '2px solid rgba(56,189,248,0.7)'
                    }}
                  >INICIAR SISTEMA</motion.button>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '12px', fontFamily: 'monospace' }}>
                    Presiona para comenzar
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>{/* ── FIN CONTENEDOR FLEX ── */}
        </motion.div>
      )}

      {started && (
        <motion.div
          key="loading"
          className="relative z-10 flex flex-col items-center justify-center w-full h-full px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Logo con entrada */}
          <motion.div
            className="relative mb-10 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Anillos giratorios */}
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} className="absolute rounded-full"
                style={{
                  width: `${160 + i * 55}px`, height: `${160 + i * 55}px`,
                  border: `2px solid rgba(56,189,248,${0.5 - i * 0.15})`
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{
                  opacity: { duration: 0.4, delay: 0.3 + i * 0.1 },
                  scale: { duration: 0.4, delay: 0.3 + i * 0.1 },
                  rotate: { duration: 8 - i * 2, repeat: Infinity, ease: "linear" }
                }}
              />
            ))}

            {/* Logo central */}
            <motion.div
              className="relative rounded-full flex items-center justify-center overflow-hidden z-10"
              style={{
                width: '150px', height: '150px',
                background: 'radial-gradient(circle, rgba(56,189,248,0.3), rgba(0,0,0,0.9))',
                border: '3px solid rgba(56,189,248,0.8)',
                boxShadow: '0 0 60px rgba(56,189,248,0.6)'
              }}
              animate={{
                boxShadow: [
                  '0 0 40px rgba(56,189,248,0.5)',
                  '0 0 70px rgba(56,189,248,0.9)',
                  '0 0 40px rgba(56,189,248,0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={fiaLogo} alt="FIA"
                className="absolute w-[130%] h-[130%] object-cover"
                style={{ filter: 'brightness(1.3) contrast(1.2)' }}
              />
            </motion.div>
          </motion.div>

          {/* Texto FIA con entrada */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-7xl font-black mb-3" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>FIA</h1>
            <p className="text-sm text-gray-600 font-light uppercase" style={{ letterSpacing: '0.3em' }}>
              FIESTA INTELLIGENCE ASSISTANT
            </p>
          </motion.div>

          {/* Barra de progreso con entrada */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #38bdf8, #3b82f6, #1d4ed8)',
                  boxShadow: '0 0 15px rgba(59,130,246,0.6)',
                  width: `${progress}%`,
                  transition: 'width 0.06s linear'
                }}
              />
              {/* Brillo que corre */}
              <motion.div
                className="absolute inset-y-0 rounded-full"
                style={{
                  width: '60px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                }}
                animate={{ x: ['-60px', '500px'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600 font-mono">
              <span>CARGANDO SISTEMA</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
