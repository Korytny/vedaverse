
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Community = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  members_count: number;
};

export type UserCommunity = {
  id: string;
  community_id: string;
  user_id: string;
  joined_at: string;
  last_activity: string;
  unread_messages: number;
  community: Community;
};

export type Activity = {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
};

export const useDashboardData = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [userCommunities, setUserCommunities] = useState<UserCommunity[]>([]);
  const [recommendedCommunities, setRecommendedCommunities] = useState<Community[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/');
        return;
      }
      
      setLoading(true);
      
      try {
        // Fetch user data from Supabase auth
        setUserData({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
        });
        
        // Fetch user's communities from Supabase
        const { data: userCommunitiesData, error: userCommunitiesError } = await supabase
          .from('user_communities')
          .select(`
            id,
            community_id,
            user_id,
            joined_at,
            last_activity,
            unread_messages,
            community:communities(*)
          `)
          .eq('user_id', user.id);
        
        if (userCommunitiesError) throw userCommunitiesError;
        
        // Transform data to match our expected format
        const formattedUserCommunities = userCommunitiesData.map((uc) => ({
          ...uc,
          community: uc.community as Community
        }));
        
        setUserCommunities(formattedUserCommunities);
        
        // Fetch recommended communities (communities user is not a member of)
        const userCommunityIds = formattedUserCommunities.map(uc => uc.community_id);
        
        const { data: allCommunities, error: allCommunitiesError } = await supabase
          .from('communities')
          .select('*');
        
        if (allCommunitiesError) throw allCommunitiesError;
        
        // Filter out communities user is already a member of
        const recommended = allCommunities
          .filter(community => !userCommunityIds.includes(community.id))
          .slice(0, 3); // Limit to 3 recommendations
        
        setRecommendedCommunities(recommended);
        
        // For demo purposes, load mock activities
        // In a real app, you would fetch this from Supabase
        const mockActivities = [
          {
            id: "1",
            type: "message",
            title: "New discussion in Web Development Mastery",
            description: "How to optimize React performance? - Started by Jason Miller",
            timestamp: "2 hours ago"
          },
          {
            id: "2",
            type: "join",
            title: "You joined Design Thinking Pro",
            description: "Welcome to the community! There are 1,872 members.",
            timestamp: "Yesterday"
          },
          {
            id: "3",
            type: "like",
            title: "Your comment received 5 likes",
            description: "In the thread: Best practices for responsive design",
            timestamp: "3 days ago"
          },
          {
            id: "4",
            type: "message",
            title: "New reply to your comment",
            description: "Sarah replied: 'That's a great suggestion, thanks!'",
            timestamp: "4 days ago"
          },
          {
            id: "5",
            type: "announcement",
            title: "Community update in Web Development Mastery",
            description: "New resources added to the learning section",
            timestamp: "1 week ago"
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) return;
    
    try {
      // Add user to community
      const { error } = await supabase
        .from('user_communities')
        .insert({
          user_id: user.id,
          community_id: communityId,
          unread_messages: 0,
          last_activity: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Successfully joined community!");
      
      // Refresh communities data
      navigate(0); // Simple refresh for now
    } catch (error: any) {
      console.error("Error joining community:", error);
      toast.error(error.message || "Failed to join community");
    }
  };

  return {
    user,
    isLoading,
    loading,
    userData,
    userCommunities,
    recommendedCommunities,
    activities,
    handleJoinCommunity
  };
};
