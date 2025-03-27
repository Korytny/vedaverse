
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <FeaturesSection />
        
        {/* Stats Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Trusted by creators worldwide</h2>
              <p className="text-lg text-muted-foreground">Join a growing community of knowledge creators and learners</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard 
                icon={<Users className="w-10 h-10" />}
                value="10,000+"
                label="Active Members"
              />
              <StatCard 
                icon={<BookOpen className="w-10 h-10" />}
                value="500+"
                label="Learning Communities"
              />
              <StatCard 
                icon={<MessageCircle className="w-10 h-10" />}
                value="25,000+"
                label="Daily Discussions"
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-12 md:p-16 text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to build your community?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  Start your journey today and connect with passionate learners from around the world.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="rounded-full px-8 text-base h-12"
                  >
                    <Link to="/communities">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg" 
                    className="rounded-full px-8 text-base h-12"
                  >
                    <Link to="/pricing">
                      View Pricing
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-xl border border-border/40 text-center"
    >
      <div className="mx-auto text-primary mb-4">{icon}</div>
      <p className="text-3xl font-display font-bold mb-1">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
};

export default Index;
