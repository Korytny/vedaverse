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
    <section className="relative w-full min-h-[70vh] bg-[url('/images/main.jpg')] bg-cover bg-no-repeat bg-top">
      <div className="absolute top-0 left-0 right-0 container px-4 mx-auto max-w-6xl pt-32">
        <motion.div variants={container} initial="hidden" animate="show" className="text-center max-w-4xl mx-auto">
          <motion.div variants={item}>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-0 text-balance relative z-20">Цифровая вселенная ведических проектов</h1>
            <div className="w-full h-4 relative mt-4">
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;