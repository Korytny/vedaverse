
import React from 'react';
import { motion } from 'framer-motion';
import { CircleUser, BookOpen, MessageSquareText, CreditCard, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <CircleUser className="w-8 h-8" />,
    title: "User Authentication",
    description: "Sign in with Google to access your personal dashboard and community content."
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Learning Communities",
    description: "Join communities focused on topics you're passionate about and connect with like-minded learners."
  },
  {
    icon: <MessageSquareText className="w-8 h-8" />,
    title: "Community Discussions",
    description: "Engage in meaningful conversations and knowledge sharing within your communities."
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Premium Content",
    description: "Access exclusive content with one-click payments for premium communities."
  }
];

const FeaturesSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle background gradients */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[5%] w-[30%] h-[30%] bg-purple-50/20 rounded-full blur-[100px]" />
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Everything you need to build a thriving community
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-muted-foreground"
          >
            Our platform provides all the tools necessary to create, manage, and grow your knowledge communities.
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="p-6 rounded-xl bg-white border border-border/40 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 text-center"
        >
          <a href="/communities" className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
            <span>Explore all features</span>
            <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
