-- Create task_comments table for task discussion
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add content column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'task_comments' AND column_name = 'content'
    ) THEN
        ALTER TABLE task_comments ADD COLUMN content TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add message column if it doesn't exist (for backward compatibility)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'task_comments' AND column_name = 'message'
    ) THEN
        ALTER TABLE task_comments ADD COLUMN message TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add created_by column if it doesn't exist (references profiles.id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'task_comments' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE task_comments ADD COLUMN created_by UUID REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column if it doesn't exist (for backward compatibility, no FK to avoid issues)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'task_comments' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE task_comments ADD COLUMN user_id UUID;
    END IF;
END $$;

-- Drop foreign key constraint if it exists (causes issues)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'task_comments_user_id_fkey'
        AND table_name = 'task_comments'
    ) THEN
        ALTER TABLE task_comments DROP CONSTRAINT task_comments_user_id_fkey;
    END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created_at ON task_comments(created_at DESC);

-- Enable RLS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Task comments are viewable by community members" ON task_comments;
DROP POLICY IF EXISTS "Task comments can be created by community members" ON task_comments;
DROP POLICY IF EXISTS "Task comments can be updated by creator" ON task_comments;
DROP POLICY IF EXISTS "Task comments can be deleted by creator" ON task_comments;

-- SELECT: Community members can view comments
CREATE POLICY "Task comments are viewable by community members"
ON task_comments FOR SELECT
USING (
  task_id IN (
    SELECT tasks.id
    FROM tasks
    JOIN user_communities ON user_communities.community_id = tasks.community_id
    WHERE user_communities.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM tasks
    JOIN communities ON communities.id = tasks.community_id
    JOIN profiles ON profiles.id = ANY(communities.owners_id)
    WHERE tasks.id = task_comments.task_id
    AND profiles.user_id = auth.uid()
  )
);

-- INSERT: Community members can create comments
CREATE POLICY "Task comments can be created by community members"
ON task_comments FOR INSERT
WITH CHECK (
  task_id IN (
    SELECT tasks.id
    FROM tasks
    JOIN user_communities ON user_communities.community_id = tasks.community_id
    WHERE user_communities.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM tasks
    JOIN communities ON communities.id = tasks.community_id
    JOIN profiles ON profiles.id = ANY(communities.owners_id)
    WHERE tasks.id = task_comments.task_id
    AND profiles.user_id = auth.uid()
  )
  AND created_by IN (
    SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
  )
);

-- UPDATE: Only comment creator can update
CREATE POLICY "Task comments can be updated by creator"
ON task_comments FOR UPDATE
USING (
  created_by IN (
    SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
  )
);

-- DELETE: Only comment creator can delete
CREATE POLICY "Task comments can be deleted by creator"
ON task_comments FOR DELETE
USING (
  created_by IN (
    SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
  )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_task_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS task_comments_updated_at ON task_comments;
CREATE TRIGGER task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_task_comments_updated_at();
