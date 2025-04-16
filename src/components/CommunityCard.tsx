import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Users } from 'lucide-react'; // Removed LockIcon
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { joinCommunity } from '@/utils/communityUtils';
// import { useTranslation } from 'react-i18next'; // REMOVE THIS LINE
import { getTranslatedField } from '@/utils/getTranslatedField';
import { useTranslation } from '@/hooks/useTranslation';

type CommunityCardProps = {
  id: string;
  name: string | object;
  description?: string | object;
  short_description?: string | object;
  members_count: number;
  image_url: string;
  // price?: number; // Removed price prop
  topics?: {en:string, hi:string, ru:string}[]
};

const CommunityCard = ({ 
    id, 
    name, 
    description,
    short_description, 
    members_count, 
    image_url, 
    // price = 0, // Removed price
    topics = [] 
}: CommunityCardProps) => {
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Since price and is_premium are removed, treat all as free
  const isPremium = false; 

  // Get translated fields
  const title = getTranslatedField(name, `name-${id}`);
  const displayDescription = getTranslatedField(short_description || description, `desc-${id}`);

  const handleJoin = async (event: React.MouseEvent) => {
    event.stopPropagation(); 
    event.preventDefault(); 

    if (!user) {
      toast.info(t('community.signInToJoinInfo'));
      navigate('/'); 
      return;
    }

    try {
      // Pass isPremium (always false now) to joinCommunity
      const result = await joinCommunity(
        id,
        name, 
        description, 
        image_url,
        members_count,
        user.id,
        isPremium, // Pass derived premium status (always false)
        topics
      );

      if (result) {
        toast.success(t('community.joinSuccess', { name: title }));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error joining community from card:", error);
      toast.error(t('community.joinError'));
    }
  };

  // Button is always for joining a free community now
  //const joinButtonText = t('communityCard.joinFree');
  const joinButtonVariant = "outline";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col bg-card hover:border-primary/50 transition-colors duration-300 shadow-sm rounded-lg">
        <Link to={`/project/${id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg" aria-label={title}> 
          {/* Changed h-40 to aspect-video */}
          <div className="relative aspect-video w-full bg-muted flex items-center justify-center overflow-hidden rounded-t-lg">
            <img
              src={image_url || './placeholder.svg'}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = './placeholder.svg'; e.currentTarget.onerror = null; }}
            />
            {/* Removed Premium Badge */} 
          </div>
        </Link>

        <CardHeader className="pb-2 pt-4">
          <Link to={`/project/${id}`} className="focus:outline-none focus:underline hover:underline">
            <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          </Link>
          <div className="flex items-center text-muted-foreground text-xs mt-1">
            <Users className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{t('communityCard.members', { count: members_count })}</span>
          </div>
        </CardHeader>

        <CardContent className="flex-grow pt-0 pb-3">
          <>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {displayDescription || t('community.noDescription')}
          </p>
          {topics && topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {topics.map((topic, index) => {
                  const translatedTopic = getTranslatedField(topic, `topic-${index}`);

                  return (
                    <Badge key={index} variant="outline" className="text-xs font-normal">
                      {translatedTopic}
                    </Badge>
                  )
                })}
            </div>
          )}
          </>
        </CardContent>

        <CardFooter className="pt-2 mt-auto flex gap-2">
          <Button
            onClick={handleJoin}
            className="w-full rounded-md text-sm"
            variant={joinButtonVariant} // Always "outline" now
            size="sm"
          >
            {t('buttons.joinCommunity')}
          </Button>
          <Link to={`/project/${id}`}>
          <Button
            className="w-full rounded-md text-sm"
            variant={"ghost"} // Always "outline" now
            size="sm"
          >
            {t('buttons.learnMore')}
          </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CommunityCard;
