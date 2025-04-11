import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom'; // Added useLocation
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageCircle, Calendar, BookOpen, Edit, Loader2 } from 'lucide-react';
import { fetchCommunityDetails, joinCommunity, leaveCommunity, checkUserMembership } from '@/utils/communityUtils';
import { fetchCommunityPosts } from '@/utils/postUtils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
// Removed unused Tabs imports
import PostItem from '@/components/PostItem';
import CreatePostForm from '@/components/CreatePostForm';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>(); // Add type for id
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get location for redirect state

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadCommunityData = async () => {
      if (!id) {
        setLoading(false);
        setCommunity(null);
        return;
      }

      setLoading(true);
      setIsMember(null);
      setMembershipLoading(user ? true : false);

      try {
        // Fetch community details (now requests posts(*) as per utils change)
        const communityData = await fetchCommunityDetails(id);

        if (communityData) {
          // Posts are fetched separately in loadPosts, but we can use communityData.posts if included
          // No sorting needed here as it was based on the removed 'projects'
          setCommunity({
            ...communityData,
            title: communityData.name, // Map from DB field names
            image: communityData.image_url,
            longDescription: communityData.description,
            shortDescription: communityData.short_description,
            members_count: communityData.members_count || 0,
            topics: communityData.topics || [],
            isPremium: communityData.is_premium || false, // Map from is_premium
            price: communityData.price || 0,
            // Store posts count if fetched via posts(*)
            posts_count: communityData.posts?.length,
            // Map created_at if needed elsewhere
            createdAt: communityData.created_at 
          });
        } else {
          // Handle case where fetchCommunityDetails returns null (e.g., 404)
          setCommunity(null);
        }

      } catch (error: any) { // Type the error
        console.error("Error loading community data:", error);
        // Display specific error from Supabase if available
        const errorMessage = error?.message || "Failed to load community details";
        toast.error(errorMessage);
        setCommunity(null); // Set community to null on error
      } finally {
        setLoading(false);
        // Ensure membership loading stops if user is not logged in
        if (!user) {
            setMembershipLoading(false);
        }
      }
    };

    loadCommunityData();
  }, [id, user]); // User dependency is important for re-checking/resetting membership status

  // useEffect to check user membership
  useEffect(() => {
    const checkMembership = async () => {
      if (user && community?.id) {
        setMembershipLoading(true);
        try {
          // checkUserMembership should exist in communityUtils now
          const membershipStatus = await checkUserMembership(community.id, user.id);
          setIsMember(membershipStatus);
        } catch (error) {
          console.error("Failed to check membership", error);
          toast.error("Could not verify membership status.");
          setIsMember(false); // Default to false on error
        } finally {
          setMembershipLoading(false);
        }
      } else {
        // If no user or no community ID, user is not a member or status is irrelevant/unknown
        setIsMember(false);
        setMembershipLoading(false); // Ensure loading is false
      }
    };

    // Only run check if community data has loaded and user exists
    if (!loading && community) {
        checkMembership();
    } else if (!user) {
        // Ensure isMember is false if user logs out while viewing or initial load without user
        setIsMember(false);
        setMembershipLoading(false);
    }

  }, [user, community, loading]); // Dependencies: user, loaded community data, and loading status

  // Separate useEffect for loading posts, dependent on community ID
  const loadPosts = async () => {
    if (!id) return;
    setPostsLoading(true);
    try {
      const postsData = await fetchCommunityPosts(id);
      // Sort posts by creation date, newest first
      postsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load community posts");
      setPosts([]); // Clear posts on error
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (id && community) { // Load posts only when we have a valid community ID and data
      loadPosts();
    }
    // Clear posts if community changes or becomes null
    if (!community) {
        setPosts([]);
    }
  }, [id, community]); // Depend on community state as well


 const handleJoin = async () => {
    if (!user) {
      toast.info("Please sign in to join communities.");
      navigate('/', { state: { from: location } }); // Redirect to login, preserving location
      return;
    }
    if (!community) return;

    // Optional: Add button loading state
    try {
      const result = await joinCommunity(
        community.id,
        community.title || community.name,
        community.longDescription || community.description,
        community.image || community.image_url,
        community.members_count || 0,
        user.id,
        community.isPremium,
        community.topics
      );

      if (result) {
        setIsMember(true); // Update membership status locally
        setCommunity((prev) => prev ? { ...prev, members_count: (prev.members_count || 0) + 1 } : null); // Optimistically update member count
        toast.success(`Successfully joined ${community.title || community.name}!`);
        loadPosts(); // Refresh posts after joining
      }
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("Failed to join community.");
    }
    // Optional: Disable button loading state
  };

  const handleLeave = async () => {
    if (!user) {
      // This case should ideally not happen if the button is shown correctly
      toast.error("Please sign in to leave communities.");
      navigate('/', { state: { from: location } });
      return;
    }
    if (!community) return;

    // Optional: Add button loading state
    try {
      const result = await leaveCommunity(
        community.id,
        user.id,
      );

      if (result) {
        setIsMember(false); // Update membership status locally
        setCommunity((prev) => prev ? { ...prev, members_count: Math.max(0, (prev.members_count || 0) - 1) } : null); // Optimistically update member count
        toast.success(`You have left ${community.title || community.name}.`);
        // Maybe reload posts if non-members see different posts?
        // loadPosts();
      }
    } catch (error) {
      console.error("Error leaving community:", error);
      toast.error("Failed to leave community.");
    }
    // Optional: Disable button loading state
  };

  // Loading state for initial community fetch
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

  // Community not found or fetch error state
  if (!community) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <PageTransition className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Community Not Found</h1>
            <p className="mb-6">The community you're looking for doesn't exist or could not be loaded.</p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  // Community loaded, render details
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

              {/* TODO: Add logic to show Edit button only for authorized users (e.g., admin, creator) */}
              <Button variant="outline" asChild>
                {/* Ensure link points to correct admin path if different from ID */}
                <Link to={`/admin/edit-project/${id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Community
                </Link>
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8"> {/* Increased gap */}
              <div className="md:w-1/3 relative rounded-xl overflow-hidden self-start"> {/* Adjusted width & self-start */} 
                <img
                  src={community.image || './placeholder.svg'} // Added fallback image
                  alt={community.title || community.name}
                  className="w-full h-auto aspect-square object-cover bg-muted" // Adjusted aspect ratio and background
                  onError={(e) => (e.currentTarget.src = './placeholder.svg')} // Handle broken image links
                />
              </div>

              <div className="md:w-2/3 space-y-4"> {/* Adjusted width */} 
                <h1 className="text-3xl md:text-4xl font-display font-bold">{community.title || community.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {community.shortDescription || 'No short description provided.'}
                </p>

                <div className="flex flex-wrap items-center gap-4"> {/* Added flex-wrap */} 
                  {community.isPremium ? (
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                        Premium Community
                      </span>
                      <p className="mt-1 text-xl font-semibold">${community.price}/month</p> {/* Adjusted styling */}
                    </div>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-medium">
                      Free Community
                    </span>
                  )}
                  {/* Join/Leave Button Logic - uses isMember state */} 
                  <div className="ml-auto flex-shrink-0"> { /* Ensure button stays right */}
                    {user ? (
                      membershipLoading ? (
                        <Button disabled size="sm">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </Button>
                      ) : isMember === true ? (
                        <Button variant="destructive" onClick={handleLeave} size="sm">
                          Leave Community
                        </Button>
                      ) : isMember === false ? (
                        <Button onClick={handleJoin} size="sm">Join Community</Button>
                      ) : null // Render nothing while membership state is null (initial)
                    ) : (
                      <Button onClick={() => navigate('/', { state: { from: location } })} size="sm">Sign in to Join</Button>
                    )}
                  </div>
                </div>

                {/* Community Stats */} 
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">Community Stats</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm"> {/* Adjusted grid and text size */} 
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{(community.members_count || 0).toLocaleString()} Members</span>
                    </div>
                     {/* Removed MessageCircle stat as it wasn't in the state */}
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      {/* Use posts.length from state as primary source, fallback to fetched count */}
                      <span className="truncate">{(posts.length ?? community.posts_count ?? 0).toLocaleString()} Posts</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2"> {/* Made wider */} 
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Created {new Date(community.createdAt || community.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Topics Covered */} 
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {(community.topics || []).map((topic: string, index: number) => (
                      <span key={index} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                        {topic}
                      </span>
                    ))}
                    {(!community.topics || community.topics.length === 0) && (
                      <span className="text-muted-foreground text-sm">No topics specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area with About and Posts */} 
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: About & Posts */} 
                <div className="md:col-span-2 space-y-8">
                  {/* About Section */} 
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About this Community</h2>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {community.longDescription || community.description || "No description provided."} {/* Added fallback */}
                    </p>
                  </div>

                  {/* Posts Section */} 
                  <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold mb-4">Community Posts</h2>
                    {/* Show post form only if user is logged in AND is a member */}
                    {user && isMember && (
                      <div className="mb-6 p-4 border rounded-lg bg-card shadow-sm"> {/* Added shadow */}
                        <CreatePostForm
                          communityId={id || ''}
                          onPostCreated={loadPosts} // Refresh posts when a new one is created
                        />
                       </div>
                    )}

                    {/* Post List or Loading/Empty State */} 
                    {postsLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p>Loading posts...</p>
                      </div>
                    ) : posts.length > 0 ? (
                      <div className="space-y-6">
                        {posts.map((post) => (
                          <PostItem
                            key={post.id}
                            post={post}
                            // isPinned={post.is_pinned} // Uncomment if pinning data is available
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-card border rounded-xl"> {/* Changed background/border */}
                        <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                        <p className="text-muted-foreground mb-4">Be the first to share something with the community!</p>
                        {/* Show Join button only if user is logged in, NOT a member, and membership known */}
                        {user ? (
                          !isMember && !membershipLoading && (
                            <Button onClick={handleJoin}>
                              Join Community to Post
                            </Button>
                          )
                        ) : (
                           <Button onClick={() => navigate('/', { state: { from: location } })}>Sign in to Post</Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Rules */} 
                <div className="md:col-span-1 bg-card border p-6 rounded-xl space-y-6 self-start h-fit shadow-sm"> {/* Changed background/border, added shadow */} 
                  <h2 className="text-lg font-semibold mb-4">Community Rules</h2> {/* Adjusted size */} 
                  <ul className="space-y-3 text-sm text-muted-foreground"> {/* Adjusted spacing/styling */}
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-foreground">1.</span>
                      <span>Be respectful to other members.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-foreground">2.</span>
                      <span>Keep discussions relevant to the community topics.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-foreground">3.</span>
                      <span>No spam, excessive self-promotion, or NSFW content.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-foreground">4.</span>
                      <span>Share knowledge, ask questions, and help others learn.</span>
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
