-- Drop all existing task policies
DROP POLICY IF EXISTS "Tasks are viewable by community members" ON tasks;
DROP POLICY IF EXISTS "Tasks can be created by community members" ON tasks;
DROP POLICY IF EXISTS "Tasks can be updated by assignee or creator or community owner" ON tasks;
DROP POLICY IF EXISTS "Tasks can be deleted by creator or community owner" ON tasks;

-- Helper: check if user is a community owner by linking auth.uid() -> profiles.user_id -> profiles.id -> communities.owners_id

-- SELECT: Members can view tasks, owners can view tasks
CREATE POLICY "Tasks are viewable by community members"
ON tasks FOR SELECT
USING (
  -- Community members
  community_id IN (
    SELECT user_communities.community_id
    FROM user_communities
    WHERE user_communities.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM communities
    JOIN profiles ON profiles.id = ANY(communities.owners_id)
    WHERE communities.id = tasks.community_id
    AND profiles.user_id = auth.uid()
  )
);

-- INSERT: Members can create tasks, owners can create tasks
CREATE POLICY "Tasks can be created by community members"
ON tasks FOR INSERT
WITH CHECK (
  community_id IN (
    SELECT user_communities.community_id
    FROM user_communities
    WHERE user_communities.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM communities
    JOIN profiles ON profiles.id = ANY(communities.owners_id)
    WHERE communities.id = tasks.community_id
    AND profiles.user_id = auth.uid()
  )
);

-- UPDATE: Assignee, creator, or community owner can update
CREATE POLICY "Tasks can be updated by assignee or creator or community owner"
ON tasks FOR UPDATE
USING (
  assigned_to IN (
    SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  OR created_by IN (
    SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM communities
    JOIN profiles ON profiles.id = ANY(communities.owners_id)
    WHERE communities.id = tasks.community_id
    AND profiles.user_id = auth.uid()
  )
);

-- DELETE: Creator or community owner can delete
CREATE POLICY "Tasks can be deleted by creator or community owner"
ON tasks FOR DELETE
USING (
  created_by IN (
    SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM communities
    JOIN profiles ON profiles.id = ANY(communities.owners_id)
    WHERE communities.id = tasks.community_id
    AND profiles.user_id = auth.uid()
  )
);
