import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Hero = () => {
  const { t } = useTranslation(); // Get translation function

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="hero" className="relative w-full min-h-[70vh] bg-[url('/images/main.jpg')] bg-cover bg-no-repeat bg-top flex items-center justify-center"> {/* Added flex centering */} 
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      <div className="relative container px-4 mx-auto max-w-6xl z-20"> {/* Ensure text is above overlay */} 
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={item}>
            {/* Use translated title */}
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white text-balance">
              {t('hero.title')}
            </h1>
            {/* Optional: Subtitle if needed */}
            {/* <p className="text-lg md:text-xl text-white/80 mb-8">{t('hero.subtitle')}</p> */}
            
            {/* Keep the decorative lines */}
            <div className="w-full h-4 relative">
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-[5px] w-1/4 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-px w-1/4" />
            </div>
          </motion.div>
          {/* Optional: Add a CTA button if needed */}
          {/* <motion.div variants={item} className="mt-10">
            <Button size="lg" onClick={() => navigate('/communities')}>{t('hero.ctaButton')}</Button>
          </motion.div> */} 
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
