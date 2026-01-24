
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Post = {
  id: string;
  community_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments_count: number;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export const fetchCommunityPosts = async (communityId: string): Promise<Post[]> => {
  try {
    // First fetch posts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    if (!postsData?.length) return [];

    // Fetch actual comment counts for each post
    const postIds = postsData.map(post => post.id);
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('post_id')
      .in('post_id', postIds);

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
    }

    // Count comments per post
    const commentCounts: Record<string, number> = {};
    if (commentsData) {
      commentsData.forEach(comment => {
        commentCounts[comment.post_id] = (commentCounts[comment.post_id] || 0) + 1;
      });
    }

    // Then fetch user profiles separately
    const userIds = postsData.map(post => post.user_id);
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // Map profiles to posts and use actual comment counts
    const postsWithUsers: Post[] = postsData.map(post => {
      const userProfile = profilesData?.find(profile => profile.id === post.user_id);
      return {
        ...post,
        comments_count: commentCounts[post.id] || 0,
        user: userProfile ? {
          full_name: userProfile.full_name,
          avatar_url: userProfile.avatar_url
        } : undefined
      };
    });

    return postsWithUsers;
  } catch (error) {
    console.error("Error fetching community posts:", error);
    return [];
  }
};

export const createPost = async (
  communityId: string,
  userId: string,
  title: string,
  content: string
): Promise<Post | null> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        community_id: communityId,
        user_id: userId,
        title,
        content
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Post created successfully');
    return data;
  } catch (error: any) {
    console.error("Error creating post:", error);
    toast.error(error.message || 'Failed to create post');
    return null;
  }
};

export const likePost = async (postId: string): Promise<boolean> => {
  try {
    // Fetch current likes count
    const { data: postData, error: fetchError } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();

    if (fetchError) throw fetchError;

    // Increment likes
    const { error: updateError } = await supabase
      .from('posts')
      .update({ likes: (postData?.likes || 0) + 1 })
      .eq('id', postId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error("Error liking post:", error);
    return false;
  }
};
