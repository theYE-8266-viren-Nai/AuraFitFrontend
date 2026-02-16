import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../shared/Navbar';

interface TrainerLayoutProps {
  children: React.ReactNode;
}

export const TrainerLayout: React.FC<TrainerLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 particle-bg relative overflow-hidden">
      {/* Background decorations with green theme for trainers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-20"
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          💪
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-3xl opacity-20"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          🏋️
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-3xl opacity-20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-1/3 text-4xl opacity-15"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          強
        </motion.div>
      </div>

      <Navbar />
      <motion.main
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  );
};