import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import polloLogo from '../../assets/pollo_fiesta_FIA.png';

// ── Confetti particle ──────────────────────────────────────────────────────────
const COLORS = ['#fbbf24','#f59e0b','#fcd34d','#fb923c','#34d399','#60a5fa','#f472b6','#a78bfa'];
const SHAPES = ['circle','square','triangle'];

function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      r: 5 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      opacity: 0.85 + Math.random() * 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.angle += p.spin;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.lineTo(p.r, p.r);
          ctx.lineTo(-p.r, p.r);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.55 }}
    />
  );
}

// ── Letter-by-letter title ─────────────────────────────────────────────────────
const TITLE = 'AGRADECIMIENTOS';

const paragraphs = [
  'La Gerencia General expresa su más profundo agradecimiento a nuestros estimados accionistas por la confianza depositada en la empresa durante este año de retos y logros compartidos.',
  'Su respaldo constante ha sido fundamental para seguir consolidando nuestro liderazgo en el sector avícola, impulsar proyectos estratégicos y fortalecer nuestro compromiso con la calidad, la innovación y la sostenibilidad.',
  'Gracias familia Roa por su visión y apoyo, continuamos avanzando con firmeza hacia un crecimiento responsable y sostenible, enfocado en generar valor para todos nuestros grupos de interés y para el futuro de nuestra organización.',
];

export default function AgradecimientosDashboard() {
  const [phase, setPhase] = useState('intro'); // intro → card

  // After logo splash, show card
  useEffect(() => {
    const t = setTimeout(() => setPhase('card'), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden">
      <Confetti />

      {/* ── INTRO SPLASH ── */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            key="intro"
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* Radial glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="absolute w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.7) 0%, transparent 70%)' }}
            />
            <motion.img
              src={polloLogo}
              alt="Pollo Fiesta"
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: [null, 360], opacity: 1 }}
              transition={{ scale: { type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }, opacity: { delay: 0.1 }, rotate: { delay: 0.6, duration: 8, repeat: Infinity, ease: 'linear' } }}
              className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-2xl font-black text-amber-700 tracking-widest relative z-10"
            >
              POLLO FIESTA S.A.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CARD ── */}
      <AnimatePresence>
        {phase === 'card' && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl px-4"
          >
            <div
              className="rounded-3xl p-10 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 45%,#fde68a 100%)',
                border: '3px solid rgba(245,158,11,0.4)',
                boxShadow: '0 30px 70px rgba(245,158,11,0.25), 0 8px 24px rgba(0,0,0,0.1)',
              }}
            >
              {/* Corner glows */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(253,230,138,0.55) 0%,transparent 70%)', transform: 'translate(30%,-30%)' }} />
              <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(251,191,36,0.35) 0%,transparent 70%)', transform: 'translate(-30%,30%)' }} />

              {/* Logo with pulse ring */}
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 14 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-amber-300"
                    style={{ filter: 'blur(10px)' }}
                  />
                  <motion.img
                    src={polloLogo}
                    alt="Logo"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="h-20 object-contain relative z-10"
                  />
                </div>
              </motion.div>

              {/* Title letter by letter */}
              <div className="flex justify-center flex-wrap mb-6">
                {TITLE.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -30, rotate: -15 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, type: 'spring', stiffness: 280, damping: 16 }}
                    className="text-3xl font-black tracking-widest"
                    style={{ color: '#92400e' }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </div>

              {/* Animated divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-7"
              />

              {/* Paragraphs */}
              {paragraphs.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.18, duration: 0.5 }}
                  className="text-gray-700 text-base leading-relaxed text-center mb-5"
                >
                  {text}
                </motion.p>
              ))}

              {/* Signature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="mt-8 pt-6 border-t-2 border-amber-300/40 text-center"
              >
                {/* Stars */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="flex justify-center gap-1 mb-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.8 + i * 0.08, type: 'spring', stiffness: 300 }}
                      className="text-amber-400 text-xl"
                    >★</motion.span>
                  ))}
                </motion.div>
                <p className="text-gray-500 text-sm italic mb-3">Atentamente,</p>
                <p className="text-xl font-black text-gray-900 tracking-wide">JOHN HENRY RESTREPO MELO</p>
                <p className="text-amber-600 font-semibold mt-1">Gerente General</p>
                <p className="text-gray-400 text-sm mt-1">Pollo Fiesta S.A. — 2025</p>

                {/* QR Code */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2, type: 'spring', stiffness: 200 }}
                  className="mt-8 flex flex-col items-center gap-3"
                >
                  <div className="p-3 bg-white rounded-2xl shadow-lg border-2 border-amber-300">
                    <QRCodeSVG
                      value="https://asamblea-2025pf.up.railway.app"
                      size={140}
                      bgColor="#ffffff"
                      fgColor="#1c1917"
                      level="M"
                      imageSettings={{
                        src: polloLogo,
                        x: undefined,
                        y: undefined,
                        height: 28,
                        width: 28,
                        excavate: true,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-medium tracking-wide">Escanea para visitar la plataforma</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
