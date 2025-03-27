
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { createPost } from '@/utils/postUtils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface CreatePostFormProps {
  communityId: string;
  onPostCreated: () => void;
}

const CreatePostForm = ({ communityId, onPostCreated }: CreatePostFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createPost(
        communityId,
        user.id,
        title,
        content
      );
      
      if (result) {
        setTitle('');
        setContent('');
        onPostCreated();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const userFullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userAvatar = user?.user_metadata?.avatar_url || '';
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 mb-4">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userFullName} />
            <AvatarFallback>{getInitials(userFullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Post title"
                className="mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
              <Textarea
                placeholder="Write something..."
                className="min-h-24 mb-3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
