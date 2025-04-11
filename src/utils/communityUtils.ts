import { supabase } from '@/integrations/supabase/client';

export const fetchCommunityDetails = async (communityId: string) => {
  try {
    const { data: communityData, error: communityError } = await supabase
      .from('communities')
      .select(`
        *,
        members_count,
        posts(*)
      `) // Changed projects(*) to posts(*)
      .eq('id', communityId)
      .single();

    if (communityError) throw communityError;

    // Optionally fetch members if needed, though members_count is often sufficient
    // const { data: membersData, error: membersError } = await supabase
    //   .from('user_communities')
    //   .select('user_id') // Select only necessary fields
    //   .eq('community_id', communityId);

    // if (membersError) throw membersError;

    // Return combined data
    return {
      ...communityData,
      // members: membersData || [] // Uncomment if fetching full member list
    };

  } catch (error) {
    // Log the specific error for better debugging
    console.error("Error fetching community details:", error);
    // Re-throw the error or return null based on desired handling
    // Returning null might lead to the "Community Not Found" page if not handled upstream
    // Throwing might be better if you want to show a generic error boundary
    throw error; // Throwing error to be caught by the caller (e.g., in the component)
  }
};


export const joinCommunity = async (
  communityId: string,
  communityName: string,
  communityDescription: string,
  communityImage: string,
  communityMembers: number,
  userId: string,
  isPremium: boolean,
  topics: string[]
) => {
  try {
    // 1. Check if the community exists, create if not
    let { data: existingCommunity, error: fetchError } = await supabase
      .from('communities')
      .select('id, members_count')
      .eq('id', communityId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: Row not found
      throw fetchError;
    }

    let currentMembersCount = communityMembers; // Use passed count initially

    if (!existingCommunity) {
      const { data: newCommunity, error: createError } = await supabase
        .from('communities')
        .insert({
          id: communityId, // Use provided ID if joining based on external source
          name: communityName,
          description: communityDescription,
          image_url: communityImage,
          members_count: 1, // Start with 1 member
          is_premium: isPremium,
          topics: topics
        })
        .select('id, members_count')
        .single();

      if (createError) throw createError;
      existingCommunity = newCommunity;
      currentMembersCount = 1;
    } else {
      // Use the actual count from the database if the community existed
      currentMembersCount = existingCommunity.members_count || 0;
    }

    // 2. Check if the user is already a member
    const { data: existingMembership, error: membershipError } = await supabase
      .from('user_communities')
      .select('user_id')
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without error

    if (membershipError) throw membershipError;

    if (existingMembership) {
      console.log("User is already a member of this community.");
      return true; // Indicate success (already a member)
    }

    // 3. Add the user to the community
    const { error: joinError } = await supabase
      .from('user_communities')
      .insert({ user_id: userId, community_id: communityId });

    if (joinError) throw joinError;

    // 4. Increment the members count (optional but good practice)
    // We fetch the count again or use the optimistic count before incrementing
    const { error: updateCountError } = await supabase
      .from('communities')
      .update({ members_count: currentMembersCount + 1 })
      .eq('id', communityId);

    if (updateCountError) {
      console.warn("Failed to update member count:", updateCountError);
      // Don't throw an error here, joining was successful, count update is secondary
    }

    console.log(`User ${userId} successfully joined community ${communityId}`);
    return true;

  } catch (error) {
    console.error("Error joining community:", error);
    return false;
  }
};


// Fetch all communities (you might want pagination here later)
export const fetchAllCommunities = async () => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*'); // Select all columns, adjust as needed

    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching communities:", error);
    return [];
  }
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  try {
    // 1. Remove the user from the community
    const { error: leaveError, count } = await supabase
      .from('user_communities')
      .delete({ count: 'exact' })
      .eq('user_id', userId)
      .eq('community_id', communityId);

    if (leaveError) throw leaveError;

    // 2. Decrement the members count only if a row was actually deleted
    if (count && count > 0) {
        const { data: communityData, error: fetchError } = await supabase
            .from('communities')
            .select('members_count')
            .eq('id', communityId)
            .single();

        if (fetchError) {
            console.warn("Failed to fetch member count before decrementing:", fetchError);
            // Proceed without decrementing if fetch fails, but log it
        } else if (communityData) {
            const currentCount = communityData.members_count || 0;
            const { error: updateCountError } = await supabase
                .from('communities')
                .update({ members_count: Math.max(0, currentCount - 1) })
                .eq('id', communityId);

            if (updateCountError) {
                console.warn("Failed to update member count after leaving:", updateCountError);
                // Don't throw, leaving was successful
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

// Function to check if a user is a member of a community
export const checkUserMembership = async (communityId: string, userId: string): Promise<boolean> => {
  try {
    // Check if user and community IDs are valid before querying
    if (!userId || !communityId) {
        console.warn('User ID or Community ID is missing for membership check.');
        return false;
    }

    const { error, count } = await supabase
      .from('user_communities')
      .select('*', { count: 'exact', head: true }) // Only count, don't fetch data
      .eq('user_id', userId)
      .eq('community_id', communityId);

    if (error) {
      // Handle specific errors if needed, e.g., network issues
      console.error('Error checking user membership:', error);
      // Decide how to handle errors: re-throw, return false, etc.
      // Returning false might be safer for UI logic depending on the context.
      return false;
    }

    // If count is null or undefined, treat as 0
    return (count ?? 0) > 0; // Return true if a record exists (count > 0)

  } catch (error) {
    // Catch any unexpected errors during the process
    console.error('Unexpected error in checkUserMembership:', error);
    return false; // Return false on unexpected errors
  }
};
