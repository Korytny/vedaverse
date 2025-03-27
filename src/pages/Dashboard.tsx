
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChatBubbleIcon, GearIcon, PlusIcon } from '@radix-ui/react-icons';
import { BookOpen, MessageSquare, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Types for communities and activities
type Community = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  members_count: number;
  unread_messages?: number;
  last_activity?: string;
};

type UserCommunity = {
  id: string;
  community_id: string;
  user_id: string;
  joined_at: string;
  last_activity: string;
  unread_messages: number;
  community: Community;
};

type Activity = {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [userCommunities, setUserCommunities] = useState<UserCommunity[]>([]);
  const [recommendedCommunities, setRecommendedCommunities] = useState<Community[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  // Get user data and communities
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        // Redirect if not logged in
        navigate('/');
        return;
      }
      
      setLoading(true);
      
      try {
        // Fetch user data from Supabase auth
        setUserData({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
        });
        
        // Fetch user's communities from Supabase
        const { data: userCommunitiesData, error: userCommunitiesError } = await supabase
          .from('user_communities')
          .select(`
            id,
            community_id,
            user_id,
            joined_at,
            last_activity,
            unread_messages,
            community:communities(*)
          `)
          .eq('user_id', user.id);
        
        if (userCommunitiesError) throw userCommunitiesError;
        
        // Transform data to match our expected format
        const formattedUserCommunities = userCommunitiesData.map((uc) => ({
          ...uc,
          community: uc.community as Community
        }));
        
        setUserCommunities(formattedUserCommunities);
        
        // Fetch recommended communities (communities user is not a member of)
        const userCommunityIds = formattedUserCommunities.map(uc => uc.community_id);
        
        const { data: allCommunities, error: allCommunitiesError } = await supabase
          .from('communities')
          .select('*');
        
        if (allCommunitiesError) throw allCommunitiesError;
        
        // Filter out communities user is already a member of
        const recommended = allCommunities
          .filter(community => !userCommunityIds.includes(community.id))
          .slice(0, 3); // Limit to 3 recommendations
        
        setRecommendedCommunities(recommended);
        
        // For demo purposes, load mock activities
        // In a real app, you would fetch this from Supabase
        const mockActivities = [
          {
            id: "1",
            type: "message",
            title: "New discussion in Web Development Mastery",
            description: "How to optimize React performance? - Started by Jason Miller",
            timestamp: "2 hours ago"
          },
          {
            id: "2",
            type: "join",
            title: "You joined Design Thinking Pro",
            description: "Welcome to the community! There are 1,872 members.",
            timestamp: "Yesterday"
          },
          {
            id: "3",
            type: "like",
            title: "Your comment received 5 likes",
            description: "In the thread: Best practices for responsive design",
            timestamp: "3 days ago"
          },
          {
            id: "4",
            type: "message",
            title: "New reply to your comment",
            description: "Sarah replied: 'That's a great suggestion, thanks!'",
            timestamp: "4 days ago"
          },
          {
            id: "5",
            type: "announcement",
            title: "Community update in Web Development Mastery",
            description: "New resources added to the learning section",
            timestamp: "1 week ago"
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [user, navigate]);

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) return;
    
    try {
      // Add user to community
      const { error } = await supabase
        .from('user_communities')
        .insert({
          user_id: user.id,
          community_id: communityId,
          unread_messages: 0,
          last_activity: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Successfully joined community!");
      
      // Refresh communities data
      navigate(0); // Simple refresh for now
    } catch (error: any) {
      console.error("Error joining community:", error);
      toast.error(error.message || "Failed to join community");
    }
  };

  // If auth is still loading or we're fetching data, show loading state
  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
          <p className="mt-2 text-muted-foreground">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  // If not logged in after checking, redirect to home
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition className="flex-grow pt-20">
        <main className="container px-4 py-12">
          <section className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white shadow">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold">Welcome, {userData.name}</h1>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
              </div>
              <Button variant="outline" className="gap-1" onClick={() => navigate('/profile')}>
                <GearIcon className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </div>
            
            <Tabs defaultValue="communities" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="communities">My Communities</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="settings">Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="communities">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Your Communities</CardTitle>
                        <Button onClick={() => navigate('/communities')} size="sm" className="gap-1">
                          <PlusIcon className="h-4 w-4" />
                          <span>Join New</span>
                        </Button>
                      </div>
                      <CardDescription>Communities you're currently a member of</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userCommunities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userCommunities.map((userCommunity) => (
                            <div key={userCommunity.id} className="flex gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow">
                              <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                                <img 
                                  src={userCommunity.community.image_url} 
                                  alt={userCommunity.community.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">{userCommunity.community.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1 gap-3">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {userCommunity.community.members_count}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    {userCommunity.unread_messages} new
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <ChatBubbleIcon className="h-3.5 w-3.5" />
                                    <span>Enter</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                          <h3 className="font-medium mb-1">No communities yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">You haven't joined any communities yet</p>
                          <Button onClick={() => navigate('/communities')}>Browse Communities</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended For You</CardTitle>
                      <CardDescription>Based on your interests and activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recommendedCommunities.map((community) => (
                          <div key={community.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                            <h3 className="font-medium mb-1">{community.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              Connect with {community.members_count.toLocaleString()} members
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleJoinCommunity(community.id)}
                            >
                              Join Community
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest interactions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {activities.length > 0 ? (
                        activities.map((activity) => (
                          <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {activity.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your profile and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <Avatar className="h-20 w-20 border-2 border-white shadow">
                          <AvatarImage src={userData.avatar} alt={userData.name} />
                          <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg">{userData.name}</h3>
                          <p className="text-muted-foreground">{userData.email}</p>
                          <Button variant="outline" size="sm" className="mt-2">Change Profile Picture</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div>
                          <h3 className="font-medium mb-2">Notification Settings</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Email notifications</span>
                              <Button variant="outline" size="sm">Configure</Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Push notifications</span>
                              <Button variant="outline" size="sm">Configure</Button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Account Security</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Change password</span>
                              <Button variant="outline" size="sm">Update</Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Two-factor authentication</span>
                              <Button variant="outline" size="sm">Enable</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
