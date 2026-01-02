
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageCircle, Share2, Send, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post, likePost } from '@/utils/postUtils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { CommentData, addComment } from '@/utils/commentUtils';

interface PostItemProps {
  post: Post;
  isPinned?: boolean;
  isOwner: boolean;
}

const PostItem = ({ post, isPinned = false, isOwner }: PostItemProps) => {
  const [likes, setLikes] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [isLiking, setIsLiking] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

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
      toast.error(t('post.likeError', 'Failed to like post'));
    }
    setIsLiking(false);
  };

  const handleCommentSubmit = async () => {
    if (!newCommentText.trim() || !user || !post.id) return;
    setIsSubmittingComment(true);
    try {
      const newCommentData = await addComment(post.id, user.id, newCommentText);
      if (newCommentData) {
        setNewCommentText('');
        setCommentsCount(prev => prev + 1);
        toast.success(t('comments.addSuccess', 'Comment added'));
      } else {
        toast.error(t('comments.addError', 'Failed to add comment'));
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error(t('comments.addError', 'Failed to add comment'));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    setLikes(post.likes);
    setCommentsCount(post.comments_count);
  }, [post.likes, post.comments_count]);

  const formattedDate = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="mb-4 overflow-hidden border border-border/60 bg-card shadow-sm">
      {/* Header: Avatar, Author, Title, Date, Pin */}
      <CardHeader className="p-3">
        <div className="flex justify-between items-start mb-1.5">
            <div className="flex items-center gap-2 flex-grow min-w-0">
                <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src={post.user?.avatar_url || undefined} alt={post.user?.full_name || 'User'} />
                    <AvatarFallback>{getInitials(post.user?.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                    {/* Author Name and Title on one line */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-semibold text-sm truncate">{post.user?.full_name || 'Unknown User'}</span>
                        <h3 className="text-base font-semibold leading-tight truncate flex-shrink min-w-[50px]">{post.title}</h3>
                    </div>
                    <div className="text-xs text-muted-foreground">{formattedDate}</div>
                </div>
            </div>
            {isPinned && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 ml-2 flex-shrink-0">
                    {t('post.pinned', 'Pinned')}
                </Badge>
            )}
        </div>
      </CardHeader>

      {/* Content: Only the post body */}
      <CardContent className="px-3 pt-0 pb-3">
          <div className="text-sm text-muted-foreground whitespace-pre-line">{post.content}</div>
      </CardContent>

      {/* Footer: Actions + Comment Input in one line */}
      <CardFooter className="border-t p-2 flex items-center gap-2 bg-muted/30 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground hover:text-primary px-2"
            onClick={handleLike}
            disabled={isLiking}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs font-medium">{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground px-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{commentsCount}</span>
          </Button>

          {user ? (
            <>
              <Textarea
                placeholder={t('comments.addCommentPlaceholder', 'Add a comment...')}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 min-h-0 text-sm resize-none max-h-10"
                rows={1}
              />
              <Button
                size="sm"
                onClick={handleCommentSubmit}
                disabled={!newCommentText.trim() || isSubmittingComment}
              >
                {isSubmittingComment ?
                  <Loader2 className="h-4 w-4 animate-spin" /> :
                  <Send className="h-4 w-4" />
                }
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary px-2">
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">{t('post.share', 'Share')}</span>
            </Button>
          )}
      </CardFooter>
    </Card>
  );
};

export default PostItem;
