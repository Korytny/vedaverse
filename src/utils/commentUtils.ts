
import { supabase } from '@/integrations/supabase/client';
import { PostgrestMaybeSingleResponse, PostgrestResponse } from '@supabase/supabase-js';

// Type for Comment data, including fetched user profile
export type CommentData = {
  id: string;
  created_at: string;
  text: string;
  post_id: string;
  user_id: string;
  likes: number;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
};

// Fetches comments for a given post ID, along with author profile data
export const fetchComments = async (postId: string): Promise<CommentData[]> => {
  if (!postId) return [];

  try {
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*, user_id') 
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      throw commentsError;
    }

    if (!commentsData || commentsData.length === 0) {
      return [];
    }

    const userIds = commentsData.map(comment => comment.user_id).filter(id => id);
    if (userIds.length === 0) {
        return commentsData as CommentData[];
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds);

    if (profilesError) {
      console.error("Error fetching commenter profiles:", profilesError);
      return commentsData as CommentData[]; // Return partial data
    }

    const commentsWithUsers = commentsData.map(comment => {
      const userProfile = profilesData?.find(profile => profile.id === comment.user_id);
      return {
        ...comment,
        user: userProfile ? {
          full_name: userProfile.full_name,
          avatar_url: userProfile.avatar_url
        } : undefined
      };
    });

    return commentsWithUsers as CommentData[];

  } catch (error) {
    console.error("Error in fetchComments process:", error);
    throw error; 
  }
};

// Adds a new comment and updates the post's comment array
export const addComment = async (
  postId: string,
  userId: string,
  text: string
): Promise<CommentData | null> => {
  if (!postId || !userId || !text.trim()) {
    console.error("Missing postId, userId, or text for addComment");
    return null;
  }

  let newCommentId: string | null = null; // Keep track of the new comment ID

  try {
    // 1. Insert the new comment
    const { data: newComment, error: insertError }: PostgrestMaybeSingleResponse<CommentData> = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        text: text.trim(),
      })
      .select('id, created_at, text, post_id, user_id, likes') // Select specific fields
      .single();

    if (insertError || !newComment) {
      console.error("Error inserting comment:", insertError);
      throw insertError || new Error("Failed to insert comment or no data returned.");
    }
    
    newCommentId = newComment.id;

    // 2. Update the post's comments array using RPC for atomicity (if available)
    //    Or fallback to fetch and update method.
    //    Using fetch and update for now as RPC function for array append isn't assumed.

    const { data: postData, error: fetchPostError } = await supabase
      .from('posts')
      .select('comments') 
      .eq('id', postId)
      .single();

    if (fetchPostError) {
      console.error("Error fetching post for comment update:", fetchPostError);
      // Consider the comment created, but the array update failed.
    } else {
        // 3. Update the post's comments array
        const currentCommentIds = (postData?.comments || []) as string[];
        // Ensure no duplicates if this runs multiple times due to retries (though unlikely here)
        const updatedCommentIds = Array.from(new Set([...currentCommentIds, newComment.id]));

        const { error: updatePostError } = await supabase
        .from('posts')
        .update({ comments: updatedCommentIds })
        .eq('id', postId);

        if (updatePostError) {
        console.error("Error updating post comments array:", updatePostError);
        // Log the error, but the comment was created. The array is out of sync.
        }
    }
    
    // 4. Fetch the user profile for the new comment to return complete data
     const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .single();
      
    return {
        ...newComment,
        user: profileError || !profileData ? undefined : {
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url
        }
    };

  } catch (error) {
    console.error("Error in addComment process:", error);
    // If comment insertion succeeded but array update failed, the comment exists.
    // If insertion failed, newCommentId is null.
    return null;
  }
};

// Deletes a comment and updates the post's comment array
export const deleteComment = async (commentId: string, postId: string): Promise<boolean> => {
    if (!commentId || !postId) {
        console.error("Missing commentId or postId for deleteComment");
        return false;
    }

    try {
        // 1. Delete the comment from the comments table
        const { error: deleteError } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (deleteError) {
            console.error("Error deleting comment:", deleteError);
            throw deleteError;
        }

        // 2. Fetch the current post's comments array
        const { data: postData, error: fetchPostError } = await supabase
            .from('posts')
            .select('comments')
            .eq('id', postId)
            .single();

        if (fetchPostError) {
            console.error("Error fetching post for comment deletion update:", fetchPostError);
            // Comment was deleted, but failed to update post array. Log and return true.
            return true;
        }

        // 3. Update the post's comments array by removing the deleted comment ID
        const currentCommentIds = (postData?.comments || []) as string[];
        const updatedCommentIds = currentCommentIds.filter(id => id !== commentId);

        const { error: updatePostError } = await supabase
            .from('posts')
            .update({ comments: updatedCommentIds })
            .eq('id', postId);

        if (updatePostError) {
            console.error("Error updating post comments array after deletion:", updatePostError);
            // Comment was deleted, but failed to update post array. Log and return true.
        }

        return true; // Successfully deleted (even if array update had issues)

    } catch (error) {
        console.error("Error in deleteComment process:", error);
        return false;
    }
};
