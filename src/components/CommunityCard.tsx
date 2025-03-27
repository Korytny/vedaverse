
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { LockIcon, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type CommunityCardProps = {
  id: string;
  title: string;
  description: string;
  members: number;
  image: string;
  isPremium: boolean;
  price?: number;
};

const CommunityCard = ({
  id,
  title,
  description,
  members,
  image,
  isPremium,
  price = 0
}: CommunityCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please sign in to join communities");
      navigate('/');
      return;
    }

    try {
      // Validate that we have a proper UUID for the community_id
      const communityId = typeof id === 'string' && 
                          id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) 
                          ? id 
                          : null;
      
      if (!communityId) {
        console.error(`Invalid UUID format for community ID: ${id}`);
        toast.error("Invalid community ID format");
        return;
      }
      
      // Check if user is already a member
      const { data: existingMembership, error: checkError } = await supabase
        .from('user_communities')
        .select('id')
        .eq('user_id', user.id)
        .eq('community_id', communityId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingMembership) {
        toast.info(`You're already a member of ${title}`);
        return;
      }
      
      // Join the community
      const { error: joinError } = await supabase
        .from('user_communities')
        .insert({
          user_id: user.id,
          community_id: communityId,
          unread_messages: 0,
          last_activity: new Date().toISOString()
        });
      
      if (joinError) throw joinError;
      
      // Success message
      if (isPremium) {
        toast.success(`Successfully joined premium community: ${title}`);
      } else {
        toast.success(`Successfully joined community: ${title}`);
      }
      
      // Increment members count
      const { error: updateError } = await supabase
        .from('communities')
        .update({ members_count: members + 1 })
        .eq('id', communityId);
      
      if (updateError) {
        console.error("Error updating members count:", updateError);
      }
      
      // Navigate to dashboard after joining
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error joining community:", error);
      toast.error(error.message || "Failed to join community");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {isPremium && (
            <div className="absolute top-4 right-4">
              <Badge variant="default" className="bg-primary/90 hover:bg-primary">
                <LockIcon className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-xl">{title}</h3>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>{members.toLocaleString()} members</span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">
            {description}
          </p>
        </CardContent>
        
        <CardFooter className="pt-2">
          <Button 
            onClick={handleJoin} 
            className="w-full rounded-md"
            variant={isPremium ? "default" : "outline"}
          >
            {isPremium ? `Join for $${price}/mo` : 'Join for Free'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CommunityCard;
