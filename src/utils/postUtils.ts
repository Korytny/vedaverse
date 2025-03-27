
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
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles!user_id(full_name, avatar_url)
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
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
    const { error } = await supabase.rpc('increment_likes', { post_id: postId });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error liking post:", error);
    return false;
  }
};
