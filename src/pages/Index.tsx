import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Info, MessageCircle, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import Mission from "@/components/Mission";
import GalleryDemo from '@/components/ui/gallery-demo';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { joinCommunity } from '@/utils/communityUtils';

const CommunityCardWithInfo = (props: any) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please sign in to join communities");
      navigate('/');
      return;
    }

    const result = await joinCommunity(
      props.id, 
      props.name, 
      props.description, 
      props.image_url, 
      props.members_count || 0, 
      user.id,
      props.is_premium
    );

    if (result) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <Link to={`/project/${props.id}`} className="absolute inset-0 flex items-center justify-center p-1">
          <img
            src={props.image_url}
            alt={props.name}
            className="h-auto w-auto max-w-full max-h-full object-contain cursor-pointer"
          />
        </Link>
        {props.is_premium && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            Premium
          </div>
        )}
      </div>
      <div className="p-5">
        <Link to={`/project/${props.id}`} className="hover:opacity-80 transition-opacity">
          <h3 className="font-display font-bold text-xl mb-2 cursor-pointer">{props.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {props.short_description || props.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{(props.members_count || 0).toLocaleString()} members</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/project/${props.id}`}>
              <Button size="sm" variant="outline">
                <Info className="h-4 w-4 mr-1" />
                Info
              </Button>
            </Link>
            <Button size="sm" onClick={handleJoin}>Join</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState<any[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<any[]>([]);
  const [missionData, setMissionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        console.log("Fetching mission data from Supabase...");
        const { data, error, status } = await supabase
          .from('mission')
          .select('title, description, image_url, img_background')
          .order('order', { ascending: true });
        
        console.log("Supabase response:", { status, data, error });
        
        if (error) {
          console.error("Supabase error details:", error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.warn("No mission data found in Supabase");
          toast.warning("Mission data not available");
          return;
        }
        
        setMissionData(data);
      } catch (error) {
        console.error("Error fetching mission data:", error);
        toast.error("Failed to load mission data. Please try again later.");
      }
    };

    fetchMissionData();
    const fetchCommunities = async () => {
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) throw error;
        
        setCommunities(data || []);
        setFilteredCommunities(data || []);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to load communities");
      }
    };

    fetchCommunities();
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = communities.filter(community => 
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (community.short_description && community.short_description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCommunities(filtered);
    } else {
      setFilteredCommunities(communities);
    }
  }, [searchQuery, communities]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section id="hero">
          <Hero />
        </section>
        
        <section id="communities" className="py-20">
          <div className="container px-4 mx-auto">
            
            {filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map(community => (
                  <CommunityCardWithInfo key={community.id} {...community} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No communities found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search</p>
                <Button onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </section>
        <Mission />
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <GalleryDemo />
          </div>
        </section>
        
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
                <Button size="lg" className="rounded-full px-8 text-base h-12" asChild>
                  <Link to="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
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
