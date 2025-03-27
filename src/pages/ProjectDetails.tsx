
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageCircle, Calendar, BookOpen, Edit, Loader2, BookText } from 'lucide-react';
import { fetchCommunityDetails, joinCommunity } from '@/utils/communityUtils';
import { fetchCommunityPosts } from '@/utils/postUtils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostItem from '@/components/PostItem';
import CreatePostForm from '@/components/CreatePostForm';

const ProjectDetails = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadCommunityData = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Try to fetch from database first
        const communityData = await fetchCommunityDetails(id);
        
        if (communityData) {
          setCommunity({
            ...communityData,
            title: communityData.name,
            image: communityData.image_url,
            longDescription: communityData.description,
            shortDescription: communityData.short_description,
            members: communityData.members_count || 0,
            topics: communityData.topics || [],
            isPremium: false,
            price: 0
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading community data:", error);
        toast.error("Failed to load community details");
        setLoading(false);
      }
    };
    
    loadCommunityData();
  }, [id]);

  const loadPosts = async () => {
    if (!id) return;
    
    setPostsLoading(true);
    try {
      const postsData = await fetchCommunityPosts(id);
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load community posts");
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPosts();
    }
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please sign in to join communities");
      navigate('/');
      return;
    }

    if (!community) return;

    const result = await joinCommunity(
      community.id, 
      community.title || community.name, 
      community.longDescription || community.description, 
      community.image || community.image_url, 
      community.members || community.members_count, 
      user.id,
      community.isPremium,
      community.topics
    );

    if (result) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <PageTransition className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <h1 className="text-xl font-medium">Loading community details...</h1>
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
            <h1 className="text-3xl font-bold mb-4">Community Not Found</h1>
            <p className="mb-6">The community you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

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
                  Back to Communities
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to={`/admin/edit-project/${id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Community
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/2 relative rounded-xl overflow-hidden">
                <img
                  src={community.image || community.image_url}
                  alt={community.title || community.name}
                  className="w-full h-full max-h-[400px] object-contain bg-gray-100"
                />
              </div>
              
              <div className="md:w-1/2 space-y-4">
                <h1 className="text-3xl md:text-4xl font-display font-bold">{community.title || community.name}</h1>
                <p className="text-muted-foreground mb-4">
                  {community.shortDescription || community.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  {community.isPremium ? (
                    <div>
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                        Premium Community
                      </span>
                      <p className="mt-2 text-2xl font-bold">${community.price}/month</p>
                    </div>
                  ) : (
                    <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-medium">
                      Free Community
                    </span>
                  )}
                  
                  <Button className="ml-auto" onClick={handleJoin}>Join Community</Button>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h3 className="font-medium mb-3">Community Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{(community.members || community.members_count || 0).toLocaleString()} Members</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-muted-foreground" />
                      <span>{(community.messages || 0).toLocaleString()} Messages</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <span>{community.posts || community.resources || 0} Posts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>Created {new Date(community.createdAt || community.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-medium mb-3">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {(community.topics || []).map((topic: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-secondary rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                    {(!community.topics || community.topics.length === 0) && (
                      <span className="text-muted-foreground">No topics specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-2">
                  <h2 className="text-2xl font-bold mb-4">About this Community</h2>
                  <p className="text-muted-foreground whitespace-pre-line mb-6">
                    {community.shortDescription || community.longDescription || community.description}
                  </p>
                  
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Community Posts</h2>
                    {user && (
                      console.log('User is logged in, showing post form'),
                      true
                    ) && (
                      <CreatePostForm
                        communityId={id || ''}
                        onPostCreated={loadPosts}
                      />
                    )}
                    
                    {postsLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p>Loading posts...</p>
                      </div>
                    ) : posts.length > 0 ? (
                      <div>
                        {posts.map((post, index) => (
                          <PostItem
                            key={post.id}
                            post={post}
                            isPinned={index < 2} // Pin first two posts for demo
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-secondary/30 rounded-xl">
                        <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                        <p className="text-muted-foreground mb-4">Be the first to share something with the community!</p>
                        {(!user || !Array.isArray(community.members) ||
                          (console.log('Join button check - members:', community.members),
                          console.log('Join button check - user:', user),
                          !community.members.some(member => String(member?.id) === String(user?.id) || String(member?.user_id) === String(user?.id))
                        )) && (
                          <Button onClick={handleJoin}>
                            {!user ? 'Join Community to Post' : 'Become Member to Post'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-6 rounded-xl space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Community Rules</h2>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">1.</span>
                      <span>Be respectful to other members</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">2.</span>
                      <span>Stay on topic with relevant content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">3.</span>
                      <span>No spam or self-promotion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">4.</span>
                      <span>Share knowledge and help others</span>
                    </li>
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
