-- Add created_by column to communities table
ALTER TABLE communities ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);

-- For uuid[] type, use array indexing (PostgreSQL arrays are 1-based)
UPDATE communities
SET created_by = owners_id[1]
WHERE created_by IS NULL
AND owners_id IS NOT NULL
AND array_length(owners_id, 1) > 0;

-- Add comment
COMMENT ON COLUMN communities.created_by IS 'User who created this community';
