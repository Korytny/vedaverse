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
  return <section className="relative pt-36 pb-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]" />
        <div className="absolute -top-[5%] -right-[5%] w-[30%] h-[30%] bg-purple-100/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[130px]" />
      </div>

      <div className="container px-4 mx-auto max-w-6xl">
        <motion.div variants={container} initial="hidden" animate="show" className="text-center max-w-4xl mx-auto">
          <motion.div variants={item}>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-balance">Цифровая вселенная ведических проектов</h1>
          </motion.div>
          <motion.div variants={item}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">Здесь вы сможете присоединиться к ведическому движению</p>
          </motion.div>
          <motion.div variants={item} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button onClick={() => navigate('/communities')} size="lg" className="rounded-full px-8 text-base h-12">Изучить сообщество</Button>
            <Button onClick={() => navigate('/pricing')} variant="outline" size="lg" className="rounded-full px-8 text-base h-12">Создать свой проект</Button>
          </motion.div>
        </motion.div>

        {/* Floating screenshots */}
        <motion.div initial={{
        opacity: 0,
        y: 60
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }} className="mt-16 relative">
          <div className="relative mx-auto max-w-5xl">
            <div className="glass rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <div className="bg-gray-800 h-10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 bg-gray-700 rounded-md w-64 h-5"></div>
              </div>
              <div className="bg-gray-50 py-8 px-12">
                <div className="grid grid-cols-3 gap-6 h-72">
                  <div className="col-span-1">
                    <div className="h-full bg-white rounded-lg border p-4 shadow-sm">
                      <div className="w-full h-6 bg-gray-100 rounded mb-4"></div>
                      <div className="flex flex-col gap-3">
                        <div className="w-full h-4 bg-gray-100 rounded"></div>
                        <div className="w-2/3 h-4 bg-gray-100 rounded"></div>
                        <div className="w-5/6 h-4 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-full bg-white rounded-lg border p-4 shadow-sm">
                      <div className="w-full h-28 bg-gray-100 rounded mb-4"></div>
                      <div className="flex flex-col gap-3">
                        <div className="w-full h-4 bg-gray-100 rounded"></div>
                        <div className="w-3/4 h-4 bg-gray-100 rounded"></div>
                        <div className="w-5/6 h-4 bg-gray-100 rounded"></div>
                        <div className="w-2/3 h-4 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div className="absolute -top-8 -right-8 w-36 h-36 glass rounded-xl shadow-lg border border-white/20 p-3" animate={{
            y: [0, -15, 0],
            rotate: [0, 2, 0],
            transition: {
              y: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              },
              rotate: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
              }
            }
          }}>
              <div className="w-full h-4 bg-gray-200 rounded mb-3"></div>
              <div className="w-2/3 h-3 bg-gray-200 rounded mb-2"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded mb-2"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
            </motion.div>
            
            <motion.div className="absolute -left-6 bottom-12 w-32 h-32 glass rounded-xl shadow-lg border border-white/20 flex flex-col p-3" animate={{
            y: [0, 15, 0],
            rotate: [0, -2, 0],
            transition: {
              y: {
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut"
              },
              rotate: {
                repeat: Infinity,
                duration: 4.5,
                ease: "easeInOut"
              }
            }
          }}>
              <div className="w-full h-10 bg-gray-200 rounded mb-2"></div>
              <div className="flex-grow flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default Hero;