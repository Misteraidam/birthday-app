import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Lock, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WishCraftReveal({ formData }) {
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    confetti({ particleCount: 120, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="bg-[#f9fafb] text-gray-900 min-h-screen">
      <AnimatePresence>
        {!started ? (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center text-center p-6"
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">
              A Personal Digital Portal
            </p>
            <button
              onClick={start}
              className="text-5xl md:text-7xl font-bold hover:underline"
            >
              Open for {formData.recipientName}
            </button>
          </motion.div>
        ) : (
          <main>
            <Hero name={formData.recipientName} bg={formData.portalBg} />

            <section className="max-w-6xl mx-auto px-6 py-24 space-y-24">
              {formData.memories.map((m, i) => (
                <Memory key={m.id} mem={m} index={i} />
              ))}
            </section>

            <Vault message={formData.secretMessage} />
          </main>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- HERO ---------- */

function Hero({ name, bg }) {
  return (
    <section className="relative h-[70vh] flex items-center justify-center text-center">
      {bg && (
        <img
          src={bg}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt=""
        />
      )}
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Happy Birthday, {name}
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          A curated collection of moments, memories, and meaning.
        </p>
      </div>
    </section>
  );
}

/* ---------- MEMORY ---------- */

function Memory({ mem, index }) {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">
          Memory {index + 1}
        </p>
        <h2 className="text-3xl font-bold mb-4">{mem.title}</h2>

        {mem.type === 'chat' && (
          <blockquote className="border-l-4 pl-4 italic text-gray-600">
            <MessageSquare size={14} className="mb-2" /> “{mem.chat}”
          </blockquote>
        )}

        {mem.type === 'coordinates' && (
          <p className="flex items-center gap-2 text-gray-500">
            <MapPin size={16} /> {mem.val}
          </p>
        )}

        {mem.type === 'rating' && (
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} fill={i < mem.rating ? "#facc15" : "none"} />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
        {mem.type === 'then-now' ? (
          <div className="grid grid-cols-2">
            <img src={mem.media} alt="" />
            <img src={mem.media2} alt="" />
          </div>
        ) : (
          <img src={mem.media} alt="" className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  );
}

/* ---------- VAULT ---------- */

function Vault({ message }) {
  return (
    <section className="bg-gray-900 text-white py-32 px-6 text-center">
      <Lock size={40} className="mx-auto mb-8 opacity-80" />
      <h3 className="text-3xl md:text-5xl font-serif italic max-w-3xl mx-auto">
        “{message || 'A moment remembered is a gift kept forever.'}”
      </h3>
      <p className="mt-6 text-xs uppercase tracking-widest opacity-50">
        End of Portal
      </p>
    </section>
  );
}
