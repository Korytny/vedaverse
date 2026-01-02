import React from 'react';
import { GlareCard } from "@/components/ui/glare-card";
import { SparklesCore } from "@/components/ui/sparkles";
import { useTranslation } from 'react-i18next';
import { getTranslatedField } from '@/utils/getTranslatedField';

interface MissionItemData {
  title: string | object;
  description: string | object;
  image_url?: string;
  img_background?: string;
}

interface MissionProps {
  missionData: MissionItemData[];
  isLoading: boolean;
}

const Mission: React.FC<MissionProps> = ({ missionData, isLoading }) => {
  const { t } = useTranslation();

  const defaultBackgrounds = [
    "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//Sridhar_Maharaj.jpg",
    "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//Saraswati_Thakur.jpg",
    "https://mcgjdjifyfojfjnkttkn.supabase.co/storage/v1/object/public/website//Govinda_Maharaj.jpg"
  ];

  if (isLoading) {
      return (
        <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-900/90 relative overflow-hidden">
           <div className="container mx-auto px-4 text-center text-white/80">
               {t('mission.loading', 'Loading mission...')}
           </div>
        </section>
      );
  }

  if (!missionData || missionData.length === 0) {
    return (
       <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-900/90 relative overflow-hidden">
           <div className="container mx-auto px-4 text-center text-white/80">
               {t('mission.noData', 'Mission data is currently unavailable.')}
           </div>
        </section>
    );
  }

  return (
    <section id="mission" className="py-20 bg-gradient-to-br from-blue-950 to-blue-900/90 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-16">
          {t('mission.sectionTitle', 'Our Mission')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl mx-auto">
          {missionData.map((mission, index) => {
            const title = getTranslatedField(mission.title, `mission-title-${index}`);
            const description = getTranslatedField(mission.description, `mission-desc-${index}`);
            const backgroundUrl = mission.img_background || defaultBackgrounds[index % defaultBackgrounds.length] || null;

            return (
              <GlareCard key={index} className="flex flex-col relative overflow-hidden rounded-xl aspect-[3/4]">
                {backgroundUrl && (
                   <div 
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 group-hover:opacity-70 opacity-50"
                    style={{ backgroundImage: `url(${backgroundUrl})` }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                
                {/* Changed p-6 to px-6 pt-6 pb-10 */}
                <div className="relative z-10 flex flex-col justify-end flex-grow px-6 pt-6 pb-10 text-center"> 
                  <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{description}</p>
                </div>
              </GlareCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Mission;
