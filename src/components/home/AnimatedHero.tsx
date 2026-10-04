"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AnimatedHero() {
  return (
    <section className="relative w-full h-[650px] flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Image with Parallax & Overlay */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 dark:opacity-30"
      />
      
      {/* Mesh Gradient Blur Effect for Elite Pro Feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] mix-blend-screen pointer-events-none" />

      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-blue-100 text-sm font-semibold tracking-wider mb-6 backdrop-blur-md uppercase">
            Geleceğinize Yatırım Yapın
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-xl leading-tight tracking-tight"
        >
          Bildung, Beratung und <br className="hidden md:block"/> soziale Projekte
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-xl md:text-2xl mb-12 text-blue-50 font-light max-w-3xl mx-auto drop-shadow-md"
        >
          Gemeinsam Potenziale entfalten – in Ludwigshafen und der Metropolregion Rhein-Neckar.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "backOut" }}
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
        >
          <Link href="/deutsch-grundbildung" className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)]">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              Zu den Integrationskursen
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </Link>
          <Link href="/telc-pruefungen" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95">
            telc Prüfungen
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
