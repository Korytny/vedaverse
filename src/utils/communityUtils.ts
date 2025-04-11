import { supabase } from '@/integrations/supabase/client';

export const fetchCommunityDetails = async (communityId: string) => {
  try {
    const { data: communityData, error: communityError } = await supabase
      .from('communities')
      // Select needed fields, excluding non-existent ones
      .select(`
        id, name, description, short_description, members_count, image_url, topics,
        members_count,
        posts(*)
      `)
      .eq('id', communityId)
      .single();

    if (communityError) throw communityError;

    return {
      ...communityData,
    };

  } catch (error) {
    console.error("Error fetching community details:", error);
    throw error;
  }
};


export const joinCommunity = async (
  communityId: string,
  communityName: string | object, // Can be JSON object/string
  communityDescription: string | object | undefined, // Can be JSON object/string or undefined
  communityImage: string,
  communityMembers: number,
  userId: string,
  // isPremium: boolean, // Removed isPremium parameter
  topics: string[] | undefined // Topics might be optional
) => {
  try {
    // 1. Check if the community exists, create if not
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
      // Ensure we insert valid data types (convert potentially parsed JSON back to string if needed, or handle object)
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
          // Removed is_premium field from insert
          topics: topics || [] // Ensure topics is an array
        })
        .select('id, members_count')
        .single();

      if (createError) throw createError;
      existingCommunity = newCommunity;
      currentMembersCount = 1;
    } else {
      currentMembersCount = existingCommunity.members_count || 0;
    }

    // 2. Check if the user is already a member
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

    // 3. Add the user to the community
    const { error: joinError } = await supabase
      .from('user_communities')
      .insert({ user_id: userId, community_id: communityId });

    if (joinError) throw joinError;

    // 4. Increment the members count
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
    // Consider re-throwing or returning a more specific error object
    return false; // Keep returning false on failure for now
  }
};


// Fetch all communities (modified to select only needed fields)
export const fetchAllCommunities = async () => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('id, name, description, short_description, members_count, image_url, topics, order') // Select necessary fields
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
