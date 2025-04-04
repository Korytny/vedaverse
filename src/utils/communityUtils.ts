
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const joinCommunity = async (
  id: string, 
  title: string, 
  description: string, 
  image: string, 
  members: number, 
  userId: string,
  isPremium?: boolean,
  topics?: string[]
) => {
  try {
    // First, check if the community exists in the database
    const { data: existingCommunity, error: communityCheckError } = await supabase
      .from('communities')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    
    if (communityCheckError) throw communityCheckError;
    
    // If community doesn't exist in the database, create it first
    if (!existingCommunity) {
      const { error: createCommunityError } = await supabase
        .from('communities')
        .insert({
          id: id,
          name: title,
          description: description,
          image_url: image,
          members_count: members,
          topics: topics || []
        });
      
      if (createCommunityError) throw createCommunityError;
    }
    
    // Check if user is already a member
    const { data: existingMembership, error: checkError } = await supabase
      .from('user_communities')
      .select('id')
      .eq('user_id', userId)
      .eq('community_id', id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingMembership) {
      toast.info(`You're already a member of ${title}`);
      return false;
    }
    
    // Join the community
    const { error: joinError } = await supabase
      .from('user_communities')
      .insert({
        user_id: userId,
        community_id: id,
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
      .eq('id', id);
    
    if (updateError) {
      console.error("Error updating members count:", updateError);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error joining community:", error);
    toast.error(error.message || "Failed to join community");
    return false;
  }
};

export const fetchCommunityDetails = async (communityId: string) => {
  try {
    // Fetch the community details from the database
    const { data: community, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', communityId)
      .maybeSingle();
    
    if (error) throw error;
    if (!community) return null;
    
    // Fetch statistics from the community_stats view
    const { data: stats, error: statsError } = await supabase
      .from('community_stats')
      .select('posts_count, total_likes, total_comments')
      .eq('id', communityId)
      .maybeSingle();
    
    if (statsError) throw statsError;
    
    return {
      ...community,
      posts: stats?.posts_count || 0,
      messages: stats?.total_comments || 0,
      resources: 0, // Default value if not in database
      createdAt: community.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching community details:", error);
    return null;
  }
};

export const fetchCommunities = async () => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching communities:", error);
    return [];
  }
};
