import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import MainGallery from '@/components/MainGallery';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Mission from "@/components/Mission";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ProjectCard from '@/components/ProjectCard';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true); 
  const [missionData, setMissionData] = useState<any[]>([]); 
  const [loadingMission, setLoadingMission] = useState(true); // Add loading state for mission
  const { t } = useTranslation(); 

  useEffect(() => {
    const fetchMissionData = async () => {
      setLoadingMission(true); // Start loading
      try {
        // Fetch fields needed for mission, including translatable ones
        const { data, error } = await supabase
          .from('mission')
          .select('title, description, image_url, img_background, order') 
          .order('order', { ascending: true });
        if (error) throw error;
        if (!data) {
          console.warn("No mission data found");
          setMissionData([]); // Set empty array if no data
          return;
        }
        setMissionData(data);
      } catch (error) {
        console.error("Error fetching mission data:", error);
        toast.error(t('index.loadMissionError', "Failed to load mission data."));
        setMissionData([]); // Set empty on error
      } finally {
          setLoadingMission(false); // Finish loading
      }
    };
    fetchMissionData();

    const fetchCommunities = async () => {
      setLoadingCommunities(true);
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('id, name, description, short_description, members_count, image_url, topics') 
          .order('order', { ascending: true }); 
          
        if (error) throw error;
        
        setCommunities(data || []);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error(t('index.loadCommunitiesError', "Failed to load communities")); 
      } finally {
        setLoadingCommunities(false);
      }
    };
    fetchCommunities();

  }, [t]); 
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section id="hero">
          <Hero />
        </section>
        
        {/* --- Projects Section --- */}
        <section id="projects" className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
              {t('index.communitiesTitle', 'Explore Projects')}
            </h2>
            
            {loadingCommunities ? (
              <div className="text-center py-12">
                 <p>{t('index.loadingCommunities', 'Loading projects...')}</p>
              </div>
            ) : communities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"> 
                {communities.map(community => (
                  <ProjectCard
                    key={community.id} 
                    id={community.id}
                    name={community.name} 
                    description={community.description} 
                    short_description={community.short_description} 
                    members_count={community.members_count}
                    image_url={community.image_url}
                    topics={community.topics}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">{t('index.noCommunitiesFound', 'No projects found')}</h3>
                <p className="text-muted-foreground">{t('index.checkBackLater', 'Please check back later.')}</p>
              </div>
            )}
          </div>
        </section>

        {/* --- Mission Section --- */} 
        {/* Pass missionData and loading state to Mission component */} 
        <Mission missionData={missionData} isLoading={loadingMission} /> 

        {/* --- Other Sections --- */} 
        <MainGallery />
        
        {/* --- Call to Action Section --- */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-12 md:p-16 text-center max-w-5xl mx-auto shadow-lg">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  {t('index.ctaTitle', 'Ready to Explore Veda Universe?')}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  {t('index.ctaSubtitle', 'Join communities, access knowledge, and start your journey today.')}
                </p>
                <Button size="lg" className="rounded-full px-8 text-base h-12 shadow hover:shadow-md transition-shadow" asChild>
                  <Link to="/dashboard">
                    <span className="flex items-center justify-center">
                      {t('index.ctaButton', 'Get Started')} 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
