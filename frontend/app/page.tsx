"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { LoginModal } from "@/components/LoginModal";
import { RegisterModal } from "@/components/RegisterModal";
import { AccountMenu } from "@/components/AccountMenu";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const navLinks = [
    "Comenzar",
    "Desarrolladores",
    "Características",
    "Recursos",
  ];

  return (
    <div className="relative min-h-screen bg-black font-sans text-white selection:bg-white/30 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <video
          className="h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Navbar overlay */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 top-0 z-20 flex w-full items-center justify-between px-6 py-6 md:px-[60px] lg:px-[120px] md:py-[20px] gap-4"
      >
        <div className="flex items-center gap-[30px] md:gap-[60px] lg:gap-[120px]">
          <div className="text-lg md:text-xl shrink-0 font-bold uppercase tracking-widest text-white cursor-pointer transition-opacity hover:opacity-80">
            LOGOIPSUM
          </div>

          <nav className="hidden items-center gap-[30px] lg:flex">
            {navLinks.map((link, idx) => (
              <motion.a
                key={link}
                href="#"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="group flex items-center gap-[14px] text-[14px] font-medium text-white transition-opacity hover:opacity-80 whitespace-nowrap"
              >
                {link}
                <svg
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.a>
            ))}
          </nav>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-end gap-3 md:gap-4 shrink-0"
        >
          <LoginModal open={loginOpen} onOpenChange={setLoginOpen}>
            <div className="hidden" />
          </LoginModal>

          <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen}>
            <div className="hidden" />
          </RegisterModal>

          <AccountMenu
            onLoginClick={() => setLoginOpen(true)}
            onRegisterClick={() => setRegisterOpen(true)}
          />
        </motion.div>
      </motion.header>

      {/* Hero Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-start pb-[80px] pt-[120px] sm:pt-[180px] md:pt-[220px] lg:pt-[280px]">
        <div className="flex w-full px-6 md:px-8 flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="mb-[24px] md:mb-[40px] flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] max-w-full sm:max-w-none"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
            <span className="text-[11px] sm:text-[13px] font-medium text-center sm:text-left">
              <span className="text-white opacity-70">
                Acceso anticipado desde el
              </span>
              <span className="text-white font-semibold tracking-wide whitespace-nowrap">
                {" "}
                1 de Mayo, 2026
              </span>
            </span>
          </motion.div>

          <div className="mb-[30px] md:mb-[40px] flex flex-col items-center perspective-[1000px] w-full">
            <motion.h1
              initial={{ opacity: 0, y: 40, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="max-w-[850px] bg-clip-text text-center text-[32px] xs:text-[36px] sm:text-[48px] md:text-[64px] font-semibold leading-[1.1] sm:leading-[1.15] text-transparent px-2"
              style={{
                backgroundImage:
                  "linear-gradient(144.5deg, rgba(255,255,255,1) 28%, rgba(255,255,255,0.2) 115%)",
                transformStyle: "preserve-3d",
              }}
            >
              Web3 a la Velocidad de la Experiencia
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="mt-[20px] md:mt-[28px] max-w-[680px] text-center text-[14px] sm:text-[16px] md:text-[18px] font-normal leading-relaxed text-white/60 px-4"
            >
              Impulsando experiencias fluidas y conexiones en tiempo real, EOS
              es la base para creadores que se mueven con propósito,
              aprovechando la resiliencia, velocidad y escala para dar forma al
              futuro.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
          >
            <motion.button
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-full border border-white/80 bg-white px-[28px] sm:px-[32px] py-[12px] sm:py-[14px] shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:bg-black hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
            >
              <div className="absolute top-0 left-1/2 h-[8px] w-[50%] -translate-x-1/2 rounded-full bg-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] opacity-100 transition-opacity group-hover:opacity-0" />
              <div className="absolute bottom-0 left-1/2 h-[8px] w-[50%] -translate-x-1/2 rounded-full bg-white opacity-0 blur-sm transition-opacity group-hover:opacity-60" />
              <span className="relative z-10 text-[14px] sm:text-[15px] font-semibold text-black transition-colors group-hover:text-white whitespace-nowrap">
                Iniciar sesión
              </span>
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
