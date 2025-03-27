
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post, likePost } from '@/utils/postUtils';
import { toast } from 'sonner';

interface PostItemProps {
  post: Post;
  isPinned?: boolean;
}

const PostItem = ({ post, isPinned = false }: PostItemProps) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const success = await likePost(post.id);
    
    if (success) {
      setLikes(prev => prev + 1);
    } else {
      toast.error('Failed to like post');
    }
    
    setIsLiking(false);
  };
  
  // Format the date for better readability
  const formattedDate = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  
  return (
    <Card className="mb-4 overflow-hidden border border-border/60">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.user?.avatar_url || ''} alt={post.user?.full_name || 'User'} />
              <AvatarFallback>{getInitials(post.user?.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.user?.full_name || 'Unknown User'}</div>
              <div className="text-sm text-muted-foreground">{formattedDate}</div>
            </div>
          </div>
          {isPinned && (
            <Badge variant="outline" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 8-9-6v20l9-6 9 6V2z" />
              </svg>
              Pinned
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <div className="text-muted-foreground whitespace-pre-line">{post.content}</div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-muted-foreground" 
            onClick={handleLike}
            disabled={isLiking}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments_count}</span>
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostItem;
