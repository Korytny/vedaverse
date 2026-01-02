import { useState, useEffect } from 'react';
import { TaskItem, TaskWithAssignee } from './TaskItem';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

export function MyTasks() {
  const { user, profileId } = useAuth();
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const authUserId = user?.id;

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    if (!profileId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, assignee:profiles!tasks_assigned_to_fkey(full_name, avatar_url), creator:profiles!tasks_created_by_fkey(full_name, avatar_url), communities!inner(name, id)')
        .eq('assigned_to', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              У вас пока нет задач. Присоединяйтесь к задачам в проектах.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              currentUserId={profileId || ''}
              authUserId={authUserId}
              isOwner={false}
              onTaskUpdate={loadTasks}
              expandedTaskId={expandedTaskId}
              onTaskExpand={setExpandedTaskId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
