-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'blocked', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  due_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_community_id ON public.tasks(community_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- Create task_comments table for task communication
CREATE TABLE IF NOT EXISTS public.task_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create index for task_comments
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON public.task_comments(task_id);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Tasks are viewable by community members"
  ON public.tasks FOR SELECT
  USING (
    community_id IN (
      SELECT community_id FROM public.user_communities WHERE user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.communities WHERE id = tasks.community_id
      AND 'ca0f547e-3896-47b8-ab1a-ba39caa3d102' = ANY(owners_id)
    )
  );

CREATE POLICY "Tasks can be created by community members"
  ON public.tasks FOR INSERT
  WITH CHECK (
    community_id IN (
      SELECT community_id FROM public.user_communities WHERE user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.communities WHERE id = tasks.community_id
      AND 'ca0f547e-3896-47b8-ab1a-ba39caa3d102' = ANY(owners_id)
    )
  );

CREATE POLICY "Tasks can be updated by assignee or creator or community owner"
  ON public.tasks FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.communities WHERE id = tasks.community_id
      AND 'ca0f547e-3896-47b8-ab1a-ba39caa3d102' = ANY(owners_id)
    )
  );

-- RLS Policies for task_comments
CREATE POLICY "Task comments are viewable by community members"
  ON public.task_comments FOR SELECT
  USING (
    task_id IN (
      SELECT t.id FROM public.tasks t
      JOIN public.user_communities uc ON t.community_id = uc.community_id
      WHERE uc.user_id = auth.uid()
    )
  );

CREATE POLICY "Task comments can be created by community members"
  ON public.task_comments FOR INSERT
  WITH CHECK (
    task_id IN (
      SELECT t.id FROM public.tasks t
      JOIN public.user_communities uc ON t.community_id = uc.community_id
      WHERE uc.user_id = auth.uid()
    )
  );
