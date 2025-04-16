import React, { useEffect, useState, useCallback, useMemo } from 'react'; 
import { useParams, Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Calendar, BookOpen, Edit, Loader2 } from 'lucide-react';
import { fetchCommunityDetails, joinCommunity, leaveCommunity, checkUserMembership } from '@/utils/communityUtils'; 
import { fetchCommunityPosts } from '@/utils/postUtils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import PostItem from '@/components/PostItem';
import CreatePostForm from '@/components/CreatePostForm';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { getTranslatedField } from '@/utils/getTranslatedField';
import AvatarStack from '@/components/ui/AvatarStack';

// Update type for member data to match RPC result
interface CommunityMemberWithAvatar {
  user_id: string;
  avatar_url: string | null;
}
interface CommunityData {
  id: string;
  name: string | object;
  description: string | object;
  short_description: string | object;
  members_count: number;
  image_url: string | null;
  topics: any[] | null; 
  createdAt?: string; 
  created_at?: string; 
  members: CommunityMemberWithAvatar[]; 
  posts?: any[]; 
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Main data loading effect
  useEffect(() => {
    let isMounted = true; 
    const loadData = async (translate: TFunction) => { 
      if (!id) {
        if (isMounted) setLoading(false);
        setCommunity(null);
        return;
      }
      if (isMounted) {
        setLoading(true);
        setCommunity(null); 
        setPosts([]);
        setIsMember(null);
      }
      try {
        const communityData = await fetchCommunityDetails(id); 
        if (!isMounted) return; 
        if (communityData) {
          // *** ADD CONSOLE LOG HERE ***
          console.log("Setting community state with members:", communityData.members);
          setCommunity(communityData as CommunityData); 
        } else {
          setCommunity(null);
        }
      } catch (error: any) {
         if (!isMounted) return;
        console.error("Error loading community data:", error);
        const errorMessage = error?.message || translate('community.loadError', "Failed to load community details"); 
        toast.error(errorMessage);
        setCommunity(null);
      } finally {
         if (isMounted) {
            setLoading(false);
         }
      }
    };
    loadData(t); 
    return () => { isMounted = false; }; 
  }, [id]); 

  // Membership check effect
  useEffect(() => {
    let isMounted = true;
    const checkMembership = async (translate: TFunction) => { 
      if (community?.id && user?.id) { 
        if (isMounted) setMembershipLoading(true);
        try {
          const membershipStatus = await checkUserMembership(community.id, user.id);
          if (isMounted) setIsMember(membershipStatus);
        } catch (error) {
          console.error("Failed to check membership", error);
           if (isMounted) toast.error(translate('community.membershipError', "Could not verify membership status.")); 
           if (isMounted) setIsMember(false);
        } finally {
           if (isMounted) setMembershipLoading(false);
        }
      } else {
         if (isMounted) {
             setIsMember(false);
             setMembershipLoading(false);
         }
      }
    };
    if (!loading) {
      checkMembership(t); 
    }
    return () => { isMounted = false; };
  }, [user?.id, community?.id, loading, t]);

  // Load posts effect
  const loadPosts = useCallback(async () => { 
    if (!community?.id) return;
    setPostsLoading(true);
    try {
      const postsData = await fetchCommunityPosts(community.id);
      postsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error(t('community.loadPostsError', "Failed to load community posts")); 
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, [community?.id, t]); 

  useEffect(() => {
    if (community?.id) {
      loadPosts();
    } else {
      setPosts([]);
    }
  }, [community?.id, loadPosts]); 

  // --- Event Handlers --- 
  const communityNameForToast = useMemo(() => {
      return getTranslatedField(community?.name as any, 'community');
  }, [community?.name, i18n.language]); 

  const handleJoin = useCallback(async () => {
    if (!user || !community) return;
    try {
      const result = await joinCommunity(
        community.id,
        community.name, 
        community.description, 
        community.image_url || '',
        community.members_count || 0,
        user.id,
        community.topics
      );
      if (result) {
        setIsMember(true);
        const updatedCommunityData = await fetchCommunityDetails(community.id);
        if (updatedCommunityData) setCommunity(updatedCommunityData as CommunityData);
        toast.success(t('community.joinSuccess', { name: communityNameForToast })); 
        loadPosts(); 
      }
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error(t('community.joinError')); 
    }
  }, [user, community, navigate, location, t, loadPosts, communityNameForToast]); 

  const handleLeave = useCallback(async () => {
    if (!user || !community) return;
    try {
      const result = await leaveCommunity(community.id, user.id);
      if (result) {
        setIsMember(false);
        const updatedCommunityData = await fetchCommunityDetails(community.id);
        if (updatedCommunityData) setCommunity(updatedCommunityData as CommunityData);
        toast.success(t('community.leaveSuccess', { name: communityNameForToast }));
      }
    } catch (error) {
      console.error("Error leaving community:", error);
      toast.error(t('community.leaveError'));
    }
  }, [user, community, t, communityNameForToast]); 


  // --- Derived State --- 
  const createdDateFormatted = useMemo(() => community?.createdAt || community?.created_at
    ? new Date(community.createdAt || community.created_at).toLocaleDateString(i18n.language)
    : 'N/A', [community?.createdAt, community?.created_at, i18n.language]);
    
  const communityTitle = getTranslatedField(community?.name as any, t('community.defaultTitle'));
  const communityShortDescription = getTranslatedField(community?.short_description as any, '');
  const communityLongDescription = getTranslatedField(community?.description as any, t('community.noDescription'));

  // Prepare data directly from community.members
  const memberAvatarsForStack = useMemo(() => (community?.members || [])
      .map(member => ({ avatar_url: member.avatar_url || null })), 
      [community?.members]); 

  // --- RENDER LOGIC --- //

  if (loading) {
     return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <PageTransition className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <h1 className="text-xl font-medium">{t('community.loading')}</h1>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  if (!community) {
     return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <PageTransition className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{t('community.notFound')}</h1>
            <p className="mb-6">{t('community.notFoundDesc')}</p>
            <Button asChild>
              <Link to="/">{t('buttons.backToHome')}</Link>
            </Button>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageTransition className="flex-grow pt-20">
        <main className="container px-4 py-12">
          <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t('buttons.backToCommunities')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/admin/edit-project/${id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  {t('buttons.editCommunity')}
                </Link>
              </Button>
            </div>

             <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="md:w-1/3 relative rounded-xl overflow-hidden self-start">
                <img
                  src={community.image_url || './placeholder.svg'}
                  alt={communityTitle}
                  className="w-full h-auto aspect-square object-cover bg-muted"
                  onError={(e) => (e.currentTarget.src = './placeholder.svg')}
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <h1 className="text-3xl md:text-4xl font-display font-bold">{communityTitle}</h1>
                <p className="text-lg text-muted-foreground">{communityShortDescription}</p>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-medium">
                    {t('community.free')}
                  </span>
                  <div className="ml-auto flex-shrink-0">
                    {user ? (
                      membershipLoading ? (
                        <Button disabled size="sm">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('community.checkingMembership')}
                        </Button>
                      ) : isMember === true ? (
                        <Button variant="destructive" onClick={handleLeave} size="sm">
                          {t('buttons.leaveCommunity')}
                        </Button>
                      ) : isMember === false ? (
                        <Button onClick={handleJoin} size="sm">{t('buttons.joinCommunity')}</Button>
                      ) : null 
                    ) : (
                      <Button onClick={() => navigate('/', { state: { from: location } })} size="sm">{t('buttons.signInToJoin')}</Button>
                    )}
                  </div>
                </div>

                 <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">{t('community.stats')}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {/* Use main loading state */}
                      {loading ? (
                         <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : memberAvatarsForStack.length > 0 ? (
                        <AvatarStack avatars={memberAvatarsForStack} />
                      ) : (
                        <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="truncate">
                        {t('community.members', { count: community.members_count || 0 })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{postsLoading ? t('community.loadingPosts') : t('community.posts', { count: posts.length })}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{t('community.created', { date: createdDateFormatted })}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">{t('community.topics')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(community.topics || []).map((topic: any, index: number) => {
                      const translatedTopic = getTranslatedField(topic as any, `topic-${index}`);
                      return (
                        <span key={index} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                          {translatedTopic}
                        </span>
                      );
                    })}
                    {(!community.topics || community.topics.length === 0) && (
                      <span className="text-muted-foreground text-sm">{t('community.noTopics')}</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

              <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{t('community.about')}</h2>
                    <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: communityLongDescription || '' }} />
                  </div>
                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold mb-4">{t('community.communityPosts')}</h2>
                    {user && isMember && (
                      <div className="mb-6 p-4 border rounded-lg bg-card shadow-sm">
                        <CreatePostForm communityId={id || ''} onPostCreated={loadPosts} />
                       </div>
                    )}
                    {postsLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p>{t('community.loadingPosts')}</p>
                      </div>
                    ) : posts.length > 0 ? (
                      <div className="space-y-6">
                        {posts.map((post) => (
                          <PostItem key={post.id} post={post} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-card border rounded-xl">
                        <h3 className="text-xl font-medium mb-2">{t('community.noPosts')}</h3>
                        <p className="text-muted-foreground mb-4">{t('community.firstPost')}</p>
                        {user ? (
                          !isMember && !membershipLoading && (
                            <Button onClick={handleJoin}>{t('buttons.joinToPost')}</Button>
                          )
                        ) : (
                           <Button onClick={() => navigate('/', { state: { from: location } })}>{t('buttons.signInToPost')}</Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-1 bg-card border p-6 rounded-xl space-y-6 self-start h-fit shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">{t('community.rules')}</h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="font-semibold text-foreground">1.</span><span>Be respectful to other members.</span></li>
                    <li className="flex items-start gap-2"><span className="font-semibold text-foreground">2.</span><span>Keep discussions relevant to the community topics.</span></li>
                    <li className="flex items-start gap-2"><span className="font-semibold text-foreground">3.</span><span>No spam, excessive self-promotion, or NSFW content.</span></li>
                    <li className="flex items-start gap-2"><span className="font-semibold text-foreground">4.</span><span>Share knowledge, ask questions, and help others learn.</span></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
