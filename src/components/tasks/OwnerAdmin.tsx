import { useState, useEffect } from 'react';
import { TaskItem, TaskWithAssignee } from './TaskItem';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { getTranslatedField } from '@/utils/getTranslatedField';

interface Community {
  id: string;
  name: string | object;
  owners_id: string | string[] | null;
}

export function OwnerAdmin() {
  const { user, profileId } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [editingTask, setEditingTask] = useState<TaskWithAssignee | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const authUserId = user?.id;

  // Form state for creating/editing tasks
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    due_date: '',
    community_id: '',
  });

  useEffect(() => {
    loadOwnerCommunities();
  }, [user]);

  useEffect(() => {
    if (communities.length > 0) {
      loadTasks();
    }
  }, [communities]);

  const loadOwnerCommunities = async () => {
    if (!profileId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, owners_id')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter communities where user is an owner
      // Handle both array and JSONB formats
      // User is owner only if they are the FIRST in the array
      const ownedCommunities = (data || []).filter((community: Community) => {
        let owners: string[] = [];

        if (Array.isArray(community.owners_id)) {
          owners = community.owners_id;
        } else if (typeof community.owners_id === 'string') {
          try {
            owners = JSON.parse(community.owners_id);
          } catch (e) {
            console.warn('Failed to parse owners_id:', community.owners_id);
          }
        }

        return owners.length > 0 && owners[0] === profileId;
      });

      setCommunities(ownedCommunities);
    } catch (error: any) {
      console.error('Error loading owner communities:', error);
      toast.error(error.message || 'Failed to load your communities');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    if (!user || communities.length === 0) return;

    try {
      const communityIds = communities.map(c => c.id);

      const { data, error } = await supabase
        .from('tasks')
        .select('*, assignee:profiles!tasks_assigned_to_fkey(full_name, avatar_url), creator:profiles!tasks_created_by_fkey(full_name, avatar_url), communities!inner(name, id)')
        .in('community_id', communityIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tasks');
    }
  };

  const handleCreateTask = async () => {
    if (!profileId || !taskForm.title.trim() || !taskForm.community_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          community_id: taskForm.community_id,
          title: taskForm.title,
          description: taskForm.description || null,
          priority: taskForm.priority,
          due_date: taskForm.due_date || null,
          created_by: profileId,
          status: 'open',
        });

      if (error) throw error;

      toast.success('Task created successfully!');
      setShowCreateDialog(false);
      resetTaskForm();
      loadTasks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: taskForm.title,
          description: taskForm.description || null,
          priority: taskForm.priority,
          due_date: taskForm.due_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingTask.id);

      if (error) throw error;

      toast.success('Task updated successfully!');
      setEditingTask(null);
      resetTaskForm();
      loadTasks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast.success('Task deleted successfully!');
      loadTasks();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      community_id: '',
    });
  };

  const openEditDialog = (task: TaskWithAssignee) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
      community_id: task.community_id,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading your communities...</div>;
  }

  if (communities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            You are not an owner of any communities yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  const tasksByStatus = {
    open: tasks.filter(t => t.status === 'open'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    blocked: tasks.filter(t => t.status === 'blocked'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Owner Admin</h2>
          <p className="text-sm text-muted-foreground">
            Manage tasks for your communities
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Create a new task for one of your communities
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="community">Community</Label>
                <Select
                  value={taskForm.community_id}
                  onValueChange={(value) => setTaskForm({ ...taskForm, community_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {getTranslatedField(community.name, 'Community')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value: any) => setTaskForm({ ...taskForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Due Date (optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Open ({tasksByStatus.open.length})
          </h3>
          {tasksByStatus.open.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">No open tasks</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasksByStatus.open.map((task) => (
                <div key={task.id} className="flex gap-2">
                  <div className="flex-1">
                    <TaskItem
                      task={task}
                      currentUserId={profileId || ''}
                      authUserId={authUserId}
                      isOwner={true}
                      onTaskUpdate={loadTasks}
                      expandedTaskId={expandedTaskId}
                      onTaskExpand={setExpandedTaskId}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(task)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            In Progress ({tasksByStatus.in_progress.length})
          </h3>
          {tasksByStatus.in_progress.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">No tasks in progress</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasksByStatus.in_progress.map((task) => (
                <div key={task.id} className="flex gap-2">
                  <div className="flex-1">
                    <TaskItem
                      task={task}
                      currentUserId={profileId || ''}
                      authUserId={authUserId}
                      isOwner={true}
                      onTaskUpdate={loadTasks}
                      expandedTaskId={expandedTaskId}
                      onTaskExpand={setExpandedTaskId}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(task)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Completed ({tasksByStatus.completed.length})
          </h3>
          {tasksByStatus.completed.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">No completed tasks</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasksByStatus.completed.map((task) => (
                <Card key={task.id} className="opacity-70">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{task.priority}</Badge>
                          <Badge className="bg-green-500">Completed</Badge>
                          {task.communities && (
                            <span className="text-sm text-muted-foreground">
                              from {getTranslatedField(task.communities.name, 'Community')}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-priority">Priority</Label>
              <Select
                value={taskForm.priority}
                onValueChange={(value: any) => setTaskForm({ ...taskForm, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-due_date">Due Date (optional)</Label>
              <Input
                id="edit-due_date"
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
              />
            </div>
            <Button onClick={handleUpdateTask} className="w-full">
              Update Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
