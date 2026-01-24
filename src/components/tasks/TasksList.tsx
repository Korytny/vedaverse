import { useState, useEffect } from 'react';
import { TaskItem, TaskWithAssignee } from './TaskItem';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface TasksListProps {
  communityId: string;
  filter?: 'all' | 'open' | 'my';
}

export function TasksList({ communityId, filter: propFilter }: TasksListProps) {
  const { user, profileId } = useAuth();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalFilter, setInternalFilter] = useState<'all' | 'open' | 'my'>('all');
  const [isOwner, setIsOwner] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const authUserId = user?.id;

  // Use propFilter if provided, otherwise use internal state
  const filter = propFilter !== undefined ? propFilter : internalFilter;
  const showFilterControls = propFilter === undefined;

  useEffect(() => {
    loadTasks();
    checkOwnerStatus();
  }, [communityId, filter]);

  const checkOwnerStatus = async () => {
    if (!profileId) return;

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('owners_id')
        .eq('id', communityId)
        .single();

      if (error) throw error;

      let owners: string[] = [];

      if (Array.isArray(data?.owners_id)) {
        owners = data.owners_id;
      } else if (typeof data?.owners_id === 'string') {
        try {
          owners = JSON.parse(data.owners_id);
        } catch (e) {
          console.warn('Failed to parse owners_id:', data.owners_id);
        }
      }

      // User is owner only if they are the FIRST in the array
      setIsOwner(owners.length > 0 && owners[0] === profileId);
    } catch (error) {
      console.error('Error checking owner status:', error);
    }
  };

  const loadTasks = async () => {
    if (!profileId) return;

    setLoading(true);
    try {
      let query = supabase
        .from('tasks')
        .select('*, assignee:profiles!tasks_assigned_to_fkey(full_name, avatar_url), creator:profiles!tasks_created_by_fkey(full_name, avatar_url)')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (filter === 'open') {
        query = query.eq('status', 'open');
      } else if (filter === 'my') {
        query = query.eq('assigned_to', profileId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t('tasks.loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {showFilterControls ? t('tasks.title') : t('tasks.openTasks')}
        </h3>
        {showFilterControls && (
          <div className="flex gap-2">
            <Badge
              variant={filter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setInternalFilter('all')}
            >
              {t('tasks.all')} ({tasks.length})
            </Badge>
            <Badge
              variant={filter === 'open' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setInternalFilter('open')}
            >
              {t('tasks.open')} ({tasks.filter(t => t.status === 'open').length})
            </Badge>
            <Badge
              variant={filter === 'my' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setInternalFilter('my')}
            >
              {t('tasks.myTasks')} ({tasks.filter(t => t.assigned_to === user?.id).length})
            </Badge>
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {filter === 'open' && t('tasks.noOpenTasks')}
          {filter === 'my' && t('tasks.noMyTasks')}
          {filter === 'all' && t('tasks.noTasks')}
        </div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            currentUserId={profileId || ''}
            authUserId={authUserId}
            isOwner={isOwner}
            onTaskUpdate={loadTasks}
            expandedTaskId={expandedTaskId}
            onTaskExpand={setExpandedTaskId}
            readOnly={true}
          />
        ))
      )}
    </div>
  );
}
