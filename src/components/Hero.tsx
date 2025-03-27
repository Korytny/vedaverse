import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const navigate = useNavigate();
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  return (
    <section className="relative h-[60vh] overflow-hidden bg-[url('/images/main.jpg')] bg-cover bg-center w-full">
      <div className="absolute top-1/4 left-0 right-0 container px-4 mx-auto max-w-6xl">
        <motion.div variants={container} initial="hidden" animate="show" className="text-center max-w-4xl mx-auto">
          <motion.div variants={item}>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-0 text-balance">Цифровая вселенная ведических проектов</h1>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;