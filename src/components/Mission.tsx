import React from 'react';
import { GlareCard } from "@/components/ui/glare-card";
import { SparklesCore } from "@/components/ui/sparkles";
import { supabase } from '@/integrations/supabase/client';

interface MissionItem {
  title: string;
  description: string;
  image_url: string;
  img_background?: string;
  order: number;
}

const Mission = () => {
  const [missions, setMissions] = React.useState<MissionItem[]>([]);

  React.useEffect(() => {
    const fetchMissions = async () => {
      try {
        const { data, error } = await supabase
          .from('mission')
          .select('title, description, image_url, order')
          .order('order', { ascending: true });
  
        if (error) throw error;
  
        if (data) {
          const missionsWithDefaults = data.map(mission => ({
            title: mission.title || '',
            description: mission.description || '',
            image_url: mission.image_url || '',
            order: mission.order || 0,
            img_background: ''
          }));
          setMissions(missionsWithDefaults);
        }
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    };

    fetchMissions();
  }, []);

  return (
    <section className="py-12 bg-gradient-to-br from-blue-950 to-blue-900/90 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">Наша миссия</h2>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-16 w-full max-w-5xl mx-auto px-4">
          {missions.map((mission, index) => (
            <GlareCard key={index} className="flex flex-col items-center justify-center p-6 relative overflow-hidden">
              {mission.img_background && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${mission.img_background})` }}
                />
              )}
              <img src={mission.image_url} alt="" className="w-24 h-24 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">{mission.title}</h3>
              <p className="text-gray-300 text-center">{mission.description}</p>
            </GlareCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;