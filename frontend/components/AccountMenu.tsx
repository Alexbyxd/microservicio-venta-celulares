'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './providers/AuthContext';
import { User, LogOut, ChevronDown } from 'lucide-react';

interface AccountMenuProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export function AccountMenu({ onLoginClick, onRegisterClick }: AccountMenuProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex gap-3 md:gap-4 shrink-0">
        <motion.button
          onClick={onLoginClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative overflow-hidden whitespace-nowrap rounded-full border-[0.6px] border-white/50 bg-black/50 backdrop-blur-md px-[18px] md:px-[29px] py-[8px] md:py-[11px] shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:border-white hover:bg-black hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] shrink-0"
        >
          <div className="absolute -top-[4px] left-1/2 h-[12px] w-[60%] -translate-x-1/2 rounded-full bg-white opacity-60 blur-xs transition-opacity group-hover:opacity-90" />
          <span className="relative z-10 text-[12px] md:text-[14px] font-medium text-white">
            Iniciar sesión
          </span>
        </motion.button>

        <motion.button
          onClick={onRegisterClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group hidden sm:block whitespace-nowrap shrink-0 relative overflow-hidden rounded-full border-[0.6px] border-transparent bg-white px-[20px] md:px-[29px] py-[10px] md:py-[11px] outline-none transition-transform hover:scale-105 active:scale-95"
        >
          <div className="absolute top-0 left-1/2 h-[8px] w-[50%] -translate-x-1/2 rounded-full bg-white drop-shadow-[0_0_8px_rgba(255,255,255,1)]" />
          <span className="relative z-10 text-[13px] md:text-[14px] font-bold text-black">
            Registrarse
          </span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border-[0.6px] border-white/50 bg-black/50 backdrop-blur-md px-[14px] md:px-[20px] py-[8px] md:py-[11px] shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:border-white hover:bg-black hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
      >
        <div className="absolute -top-[4px] left-1/2 h-[12px] w-[60%] -translate-x-1/2 rounded-full bg-white opacity-60 blur-xs transition-opacity group-hover:opacity-90" />
        <User className="w-4 h-4 text-white" />
        <span className="relative z-10 text-[12px] md:text-[14px] font-medium text-white">
          Mi cuenta
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3 text-white/70" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 min-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="p-3 border-b border-white/10">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}