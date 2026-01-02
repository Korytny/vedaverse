-- Create task_steps table for tracking task completion stages
CREATE TABLE IF NOT EXISTS task_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_task_steps_task_id ON task_steps(task_id);

-- Enable RLS
ALTER TABLE task_steps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Task steps are viewable by community members" ON task_steps;
DROP POLICY IF EXISTS "Task steps can be created by community members" ON task_steps;
DROP POLICY IF EXISTS "Task steps can be updated by community members" ON task_steps;
DROP POLICY IF EXISTS "Task steps can be deleted by creator or community owner" ON task_steps;

-- Helper: check if user is a community member or owner via profile linkage
CREATE POLICY "Task steps are viewable by community members"
ON task_steps FOR SELECT
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
    WHERE tasks.id = task_steps.task_id
    AND profiles.user_id = auth.uid()
  )
);

-- INSERT: Community members can create steps
CREATE POLICY "Task steps can be created by community members"
ON task_steps FOR INSERT
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
    WHERE tasks.id = task_steps.task_id
    AND profiles.user_id = auth.uid()
  )
);

-- UPDATE: Community members can update steps
CREATE POLICY "Task steps can be updated by community members"
ON task_steps FOR UPDATE
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
    WHERE tasks.id = task_steps.task_id
    AND profiles.user_id = auth.uid()
  )
);

-- DELETE: Creator or community owner can delete steps
CREATE POLICY "Task steps can be deleted by creator or community owner"
ON task_steps FOR DELETE
USING (
  created_by IN (
    SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM tasks
    JOIN communities ON communities.id = tasks.community_id
    JOIN profiles ON profiles.id = ANY(communities.owners_id)
    WHERE tasks.id = task_steps.task_id
    AND profiles.user_id = auth.uid()
  )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_task_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS task_steps_updated_at ON task_steps;
CREATE TRIGGER task_steps_updated_at
  BEFORE UPDATE ON task_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_task_steps_updated_at();
