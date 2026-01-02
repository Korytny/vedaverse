import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Crown, ChevronDown, ChevronRight, Pause, CheckCircle, HelpCircle, MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export type Task = {
  id: string;
  community_id: string;
  title: string;
  description: string | null;
  status: 'open' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string | null;
  created_by: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskWithAssignee = Task & {
  assignee?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  creator?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export type TaskStep = {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  order_index: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskComment = {
  id: string;
  task_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

interface TaskItemProps {
  task: TaskWithAssignee;
  currentUserId: string;
  authUserId?: string;
  isOwner: boolean;
  onTaskUpdate?: () => void;
  expandedTaskId: string | null;
  onTaskExpand: (taskId: string) => void;
}

export function TaskItem({ task, currentUserId, authUserId, isOwner, onTaskUpdate, expandedTaskId, onTaskExpand }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const isExpanded = expandedTaskId === task.id;

  // Load steps and comments when task is expanded
  useEffect(() => {
    if (isExpanded) {
      loadSteps();
      loadComments();
    }
  }, [isExpanded, task.id]);

  const loadSteps = async () => {
    setIsLoadingSteps(true);
    try {
      const { data, error } = await supabase
        .from('task_steps')
        .select('*')
        .eq('task_id', task.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSteps(data || []);
    } catch (error: any) {
      console.error('Error loading steps:', error);
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const handleAddStep = async () => {
    if (!newStepTitle.trim() || !currentUserId) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('task_steps')
        .insert({
          task_id: task.id,
          title: newStepTitle.trim(),
          order_index: steps.length,
          created_by: currentUserId,
        });

      if (error) throw error;

      toast.success('Этап добавлен!');
      setNewStepTitle('');
      loadSteps();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add step');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStep = async (step: TaskStep) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('task_steps')
        .update({ completed: !step.completed })
        .eq('id', step.id);

      if (error) throw error;

      loadSteps();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update step');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('task_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;

      toast.success('Этап удален');
      loadSteps();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete step');
    } finally {
      setIsUpdating(false);
    }
  };

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select('*, author:profiles!task_comments_created_by_fkey(full_name, avatar_url)')
        .eq('task_id', task.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUserId) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('task_comments')
        .insert({
          task_id: task.id,
          content: newComment.trim(),
          message: newComment.trim(), // For backward compatibility
          created_by: currentUserId,
          user_id: authUserId,
        });

      if (error) throw error;

      toast.success('Комментарий добавлен!');
      setNewComment('');
      loadComments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast.success('Комментарий удален');
      loadComments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    } finally {
      setIsUpdating(false);
    }
  };

  const completedSteps = steps.filter(s => s.completed).length;
  const progressPercentage = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

  const isAssignedToMe = task.assigned_to === currentUserId;
  const canTakeTask = !task.assigned_to;

  const handleTakeTask = async () => {
    if (!currentUserId) return;

    setIsUpdating(true);
    try {
      // First, add user to community members if not already a member
      const { data: existingMember } = await supabase
        .from('user_communities')
        .select('user_id')
        .eq('community_id', task.community_id)
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (!existingMember) {
        const { error: memberError } = await supabase
          .from('user_communities')
          .insert({
            community_id: task.community_id,
            user_id: currentUserId,
          });

        if (memberError) throw memberError;
      }

      // Then assign the task
      const { error } = await supabase
        .from('tasks')
        .update({
          assigned_to: currentUserId,
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id);

      if (error) throw error;

      toast.success('Вы присоединились к задаче!');
      onTaskUpdate?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to take task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Task['status']) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id);

      if (error) throw error;

      toast.success('Task status updated!');
      onTaskUpdate?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="mb-3 border-border/60">
      <CardContent
        className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onTaskExpand(task.id)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isExpanded ? <ChevronDown className="h-4 w-4 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm mb-1">{task.title}</h4>
              {task.description && !isExpanded && (
                <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {task.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {task.assignee.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            {canTakeTask && (
              <Button
                onClick={(e) => { e.stopPropagation(); handleTakeTask(); }}
                disabled={isUpdating}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                {isUpdating ? '...' : 'Присоединиться'}
              </Button>
            )}
            {isOwner && (
              <Badge className="bg-yellow-500 text-white">
                <Crown className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      {isExpanded && (
        <CardContent className="px-3 pb-3 border-t border-border/60 pt-3">
          {/* Info Panel */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-muted/30 rounded-lg">
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex items-center gap-1"
              onClick={() => handleUpdateStatus(task.status === 'blocked' ? 'in_progress' : 'blocked')}
              disabled={isUpdating}
            >
              <Pause className="h-3 w-3" />
              {task.status === 'blocked' ? 'Снять с паузы' : 'Пауза'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex items-center gap-1 text-green-600"
              onClick={() => handleUpdateStatus('completed')}
              disabled={isUpdating}
            >
              <CheckCircle className="h-3 w-3" />
              Выполнено
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex items-center gap-1"
              onClick={() => {/* TODO: request help */}}
            >
              <HelpCircle className="h-3 w-3" />
              Помощь
            </Button>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
          )}

          {/* Steps section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-semibold">Этапы выполнения</h5>
              <span className="text-xs text-muted-foreground">
                {completedSteps}/{steps.length}
              </span>
            </div>

            {/* Progress bar */}
            {steps.length > 0 && (
              <Progress value={progressPercentage} className="h-2 mb-3" />
            )}

            {/* Add new step */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Новый этап..."
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                className="flex-1 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddStep()}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="sm"
                disabled={!newStepTitle.trim() || isUpdating}
                onClick={(e) => { e.stopPropagation(); handleAddStep(); }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Steps list */}
            {isLoadingSteps ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : steps.length === 0 ? (
              <div className="text-xs text-muted-foreground italic p-3 bg-muted/30 rounded-lg">
                Добавьте первый этап для отслеживания прогресса
              </div>
            ) : (
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => handleToggleStep(step)}
                      className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className={`flex-1 text-sm ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {step.title}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); handleDeleteStep(step.id); }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments section */}
          <div className="border-t border-border/60 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h5 className="text-xs font-semibold">Комментарии</h5>
              <span className="text-xs text-muted-foreground">({comments.length})</span>
            </div>

            {/* Comments list */}
            {isLoadingComments ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-xs text-muted-foreground italic mb-3">
                Пока нет комментариев. Будьте первым!
              </div>
            ) : (
              <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2 group">
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {comment.author?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {comment.author?.full_name || 'Пользователь'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{comment.content}</p>
                    </div>
                    {comment.created_by === currentUserId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); handleDeleteComment(comment.id); }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Добавить комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 text-sm resize-none"
                rows={2}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="sm"
                disabled={!newComment.trim() || isUpdating}
                onClick={(e) => { e.stopPropagation(); handleAddComment(); }}
              >
                Отправить
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
