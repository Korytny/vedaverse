
-- This file is for documentation purposes only. 
-- The following SQL was executed to create the increment_likes function:

-- Function to increment likes on a post
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts
  SET likes = likes + 1
  WHERE id = post_id;
END;
$$;
