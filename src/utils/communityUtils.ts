import { supabase } from '@/integrations/supabase/client';

// Updated type for member data returned by RPC
interface CommunityMemberWithAvatar {
  user_id: string;
  avatar_url: string | null; // RPC function returns text, so string | null
}

export const fetchCommunityDetails = async (communityId: string) => {
  try {
    // --- First Query: Fetch main community details --- 
    const { data: communityData, error: communityError } = await supabase
      .from('communities')
      .select(`
        id, name, description, short_description, members_count, image_url, topics, created_at
      `)
      .eq('id', communityId)
      .single();

    if (communityError) {
      console.error("Error fetching community main data:", communityError);
      throw communityError;
    }

    if (!communityData) {
      return null; // Community not found
    }

    // --- Second Query: Call RPC function to get members with avatars --- 
    let membersWithAvatars: CommunityMemberWithAvatar[] = [];
    try {
      const { data: memberData, error: rpcError } = await supabase.rpc('get_community_members_with_avatars', {
        p_community_id: communityId 
      });
        
      // *** ADD CONSOLE LOG HERE ***
      console.log(`[RPC Result for ${communityId}]:`, memberData);

      if (rpcError) {
         console.error("Error calling RPC function get_community_members_with_avatars:", rpcError);
      } else {
        membersWithAvatars = (memberData || []) as CommunityMemberWithAvatar[];
      }
    } catch(err) {
         console.error("Caught error calling RPC:", err);
    }

    // Return combined data
    return {
      ...communityData,
      members: membersWithAvatars, 
    };

  } catch (error) {
    console.error("Error in fetchCommunityDetails process:", error);
    throw error;
  }
};

// joinCommunity remains the same
export const joinCommunity = async (
  communityId: string,
  communityName: string | object, 
  communityDescription: string | object | undefined, 
  communityImage: string,
  communityMembers: number,
  userId: string,
  topics: string[] | undefined 
) => {
  try {
    let { data: existingCommunity, error: fetchError } = await supabase
      .from('communities')
      .select('id, members_count')
      .eq('id', communityId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let currentMembersCount = communityMembers;

    if (!existingCommunity) {
      const nameToInsert = typeof communityName === 'object' ? JSON.stringify(communityName) : communityName;
      const descriptionToInsert = typeof communityDescription === 'object' ? JSON.stringify(communityDescription) : communityDescription;
      
      const { data: newCommunity, error: createError } = await supabase
        .from('communities')
        .insert({
          id: communityId, 
          name: nameToInsert,
          description: descriptionToInsert,
          image_url: communityImage,
          members_count: 1,
          topics: topics || []
        })
        .select('id, members_count')
        .single();

      if (createError) throw createError;
      existingCommunity = newCommunity;
      currentMembersCount = 1;
    } else {
      currentMembersCount = existingCommunity.members_count || 0;
    }

    const { data: existingMembership, error: membershipError } = await supabase
      .from('user_communities')
      .select('user_id')
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .maybeSingle(); 

    if (membershipError) throw membershipError;

    if (existingMembership) {
      console.log("User is already a member of this community.");
      return true; 
    }

    const { error: joinError } = await supabase
      .from('user_communities')
      .insert({ user_id: userId, community_id: communityId });

    if (joinError) throw joinError;

    const { error: updateCountError } = await supabase
      .from('communities')
      .update({ members_count: currentMembersCount + 1 })
      .eq('id', communityId);

    if (updateCountError) {
      console.warn("Failed to update member count:", updateCountError);
    }

    console.log(`User ${userId} successfully joined community ${communityId}`);
    return true;

  } catch (error) {
    console.error("Error joining community:", error);
    return false;
  }
};

// fetchAllCommunities remains the same
export const fetchAllCommunities = async () => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('id, name, description, short_description, members_count, image_url, topics, order')
      .order('order', { ascending: true }); 

    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching all communities:", error);
    return [];
  }
};

// leaveCommunity remains the same
export const leaveCommunity = async (communityId: string, userId: string) => {
  try {
    const { error: leaveError, count } = await supabase
      .from('user_communities')
      .delete({ count: 'exact' })
      .eq('user_id', userId)
      .eq('community_id', communityId);

    if (leaveError) throw leaveError;

    if (count && count > 0) {
        const { data: communityData, error: fetchError } = await supabase
            .from('communities')
            .select('members_count')
            .eq('id', communityId)
            .single();

        if (fetchError) {
            console.warn("Failed to fetch member count before decrementing:", fetchError);
        } else if (communityData) {
            const currentCount = communityData.members_count || 0;
            const { error: updateCountError } = await supabase
                .from('communities')
                .update({ members_count: Math.max(0, currentCount - 1) })
                .eq('id', communityId);

            if (updateCountError) {
                console.warn("Failed to update member count after leaving:", updateCountError);
            }
        }
    }

    console.log(`User ${userId} successfully left community ${communityId}`);
    return true;
  } catch (error) {
    console.error("Error leaving community:", error);
    return false;
  }
};

// checkUserMembership remains the same
export const checkUserMembership = async (communityId: string, userId: string): Promise<boolean> => {
  try {
    if (!userId || !communityId) {
        console.warn('User ID or Community ID is missing for membership check.');
        return false;
    }

    const { error, count } = await supabase
      .from('user_communities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('community_id', communityId);

    if (error) {
      console.error('Error checking user membership:', error);
      return false;
    }

    return (count ?? 0) > 0; 

  } catch (error) {
    console.error('Unexpected error in checkUserMembership:', error);
    return false; 
  }
};
