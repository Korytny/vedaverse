
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

// Mock data - would be fetched from Supabase in real implementation
const userData = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/150?img=68",
};

const userCommunities = [
  {
    id: "1",
    name: "Web Development Mastery",
    unreadMessages: 12,
    lastActivity: "2 hours ago",
    members: 2543,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Design Thinking Pro",
    unreadMessages: 5,
    lastActivity: "Yesterday",
    members: 1872,
    image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?q=80&w=2072&auto=format&fit=crop",
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock authentication state

  // Redirect if not logged in - would be handled by Supabase auth in real implementation
  useEffect(() => {
    // For demo purposes, simulate login
    setIsLoggedIn(true);
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [navigate]);

  if (!isLoggedIn) {
    return null; // Loading state while checking auth
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
              <Button variant="outline" className="gap-1" onClick={() => navigate('/settings')}>
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
                          {userCommunities.map((community) => (
                            <div key={community.id} className="flex gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow">
                              <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                                <img 
                                  src={community.image} 
                                  alt={community.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">{community.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1 gap-3">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {community.members}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    {community.unreadMessages} new
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
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                            <h3 className="font-medium mb-1">AI & Machine Learning</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              Connect with AI enthusiasts and learn from industry experts
                            </p>
                            <Button variant="outline" size="sm" className="w-full">View Community</Button>
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
                      {userCommunities.length > 0 ? (
                        [...Array(5)].map((_, i) => (
                          <div key={i} className="flex gap-4 pb-4 border-b last:border-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">New discussion in Web Development Mastery</p>
                              <p className="text-sm text-muted-foreground">
                                "How to optimize React performance?" - Started by Jason Miller
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
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
