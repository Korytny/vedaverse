-- Add user_id column to profiles table to link with auth.users
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update existing profile with correct auth.users.id
UPDATE profiles
SET user_id = '3a6a0145-54bf-4d31-b7c0-2c9d3d705f22'
WHERE id = 'ca0f547e-3896-47b8-ab1a-ba39caa3d102';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
