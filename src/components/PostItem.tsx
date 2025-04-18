
import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageCircle, Share2, Send, Loader2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post, likePost } from '@/utils/postUtils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; 
import { useTranslation } from 'react-i18next';
import { CommentData, fetchComments, addComment, deleteComment } from '@/utils/commentUtils'; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PostItemProps {
  post: Post;
  isPinned?: boolean;
  isOwner: boolean;
}

const PostItem = ({ post, isPinned = false, isOwner }: PostItemProps) => {
  const [likes, setLikes] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]); 
  const [commentsLoading, setCommentsLoading] = useState(false);
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

  const loadComments = useCallback(async () => {
    if (!post.id) return;
    setCommentsLoading(true);
    try {
      const fetchedComments = await fetchComments(post.id);
      setComments(fetchedComments);
    } catch (error) { 
      console.error("Failed to load comments:", error);
      toast.error(t('comments.loadError', 'Failed to load comments'));
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [post.id, t]);

  useEffect(() => {
      loadComments();
  }, [loadComments]);

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
          setComments(prev => [...prev, newCommentData]);
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

  const handleConfirmDelete = async (commentId: string) => {
      if (!commentId) return;
      try {
          const success = await deleteComment(commentId, post.id);
          if (success) {
              setComments(prev => prev.filter(comment => comment.id !== commentId));
              setCommentsCount(prev => Math.max(0, prev - 1));
              toast.success(t('comments.deleteSuccess', 'Comment deleted'));
          } else {
              toast.error(t('comments.deleteError', 'Failed to delete comment'));
          }
      } catch (error) {
           console.error("Error deleting comment:", error);
           toast.error(t('comments.deleteError', 'Failed to delete comment'));
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
        <div className="flex justify-between items-start mb-1.5"> {/* Added margin-bottom */} 
            <div className="flex items-center gap-2 flex-grow min-w-0"> {/* Added flex-grow and min-w-0 */} 
                <Avatar className="h-9 w-9 flex-shrink-0"> {/* Added flex-shrink-0 */} 
                    <AvatarImage src={post.user?.avatar_url || undefined} alt={post.user?.full_name || 'User'} />
                    <AvatarFallback>{getInitials(post.user?.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0"> {/* Added flex-grow and min-w-0 */} 
                    {/* Author Name and Title on one line */} 
                    <div className="flex items-baseline gap-2 flex-wrap"> 
                        <span className="font-semibold text-sm truncate">{post.user?.full_name || 'Unknown User'}</span>
                        <h3 className="text-base font-semibold leading-tight truncate flex-shrink min-w-[50px]">{post.title}</h3> {/* Title moved here, adjusted size */} 
                    </div>
                    <div className="text-xs text-muted-foreground">{formattedDate}</div>
                </div>
            </div>
            {isPinned && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 ml-2 flex-shrink-0"> {/* Added margin-left and flex-shrink-0 */} 
                    {t('post.pinned', 'Pinned')}
                </Badge>
            )}
        </div>
      </CardHeader>

      {/* Content: Only the post body */} 
      <CardContent className="px-3 pt-0 pb-3"> {/* Removed top padding */} 
          <div className="text-sm text-muted-foreground whitespace-pre-line">{post.content}</div>
      </CardContent>

      {/* Footer: Actions */}
      <CardFooter className="border-t p-2 flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-1">
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
              className="flex items-center gap-1 text-muted-foreground px-2 cursor-default hover:bg-transparent" 
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">{commentsCount}</span> 
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary px-2">
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-xs">{t('post.share', 'Share')}</span>
          </Button>
      </CardFooter>

      {/* Comment Section */} 
      <div className="border-t p-3 bg-background">
          {/* Comment Input */} 
          {user && (
              <div className="flex items-center gap-2 mb-4">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={user.user_metadata?.full_name || 'You'} />
                  <AvatarFallback>{getInitials(user.user_metadata?.full_name)}</AvatarFallback>
                </Avatar>
                <Textarea 
                  placeholder={t('comments.addCommentPlaceholder', 'Add a comment...')}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 min-h-0 text-sm resize-none"
                  rows={1}
                />
                <Button 
                  size="sm" 
                  onClick={handleCommentSubmit}
                  disabled={!newCommentText.trim() || isSubmittingComment}
                  className="flex-shrink-0"
                >
                  {isSubmittingComment ? 
                    <Loader2 className="h-4 w-4 animate-spin" /> :
                    <Send className="h-4 w-4" />
                  }
                </Button>
              </div>
            )}

          {/* Comment List */} 
          {commentsLoading ? (
              <div className="text-center py-4">
                 <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {comments.map((comment) => {
                  const canDelete = isOwner || user?.id === comment.user_id;
                  return (
                    <AlertDialog key={comment.id}> 
                      <div className="flex items-start gap-2 text-sm group">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={comment.user?.avatar_url || undefined} alt={comment.user?.full_name || 'User'} />
                          <AvatarFallback>{getInitials(comment.user?.full_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted px-3 py-1.5 rounded-md relative">
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold mr-2 text-foreground/95">{comment.user?.full_name || 'User'}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="mt-0.5 text-foreground/90 whitespace-pre-line">{comment.text}</p>
                          
                          {canDelete && (
                            <AlertDialogTrigger asChild>
                               <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-0 right-0 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </AlertDialogTrigger>
                          )}
                        </div>
                      </div>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('comments.deleteConfirmTitle', 'Are you sure?')}</AlertDialogTitle>
                          <AlertDialogDescription>
                             {t('comments.deleteConfirmDesc', 'This action cannot be undone. This will permanently delete the comment.')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('comments.deleteCancel', 'Cancel')}</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleConfirmDelete(comment.id)} 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              {t('comments.deleteConfirm', 'Delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  );
                })}
              </div>
            ) : (
               !user ? 
                  <p className="text-sm text-center text-muted-foreground py-2">{t('comments.signInToComment', 'Sign in to view and add comments.')}</p> :
                  <p className="text-sm text-center text-muted-foreground py-2">{t('comments.noComments', 'No comments yet. Be the first!')}</p> 
            )}
        </div>
    </Card>
  );
};

export default PostItem;
