
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserHeader from '@/components/dashboard/UserHeader';
import UserCommunities from '@/components/dashboard/UserCommunities';
import RecommendedCommunities from '@/components/dashboard/RecommendedCommunities';
import UserActivities from '@/components/dashboard/UserActivities';
import UserAccount from '@/components/dashboard/UserAccount';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const {
    user,
    isLoading,
    loading,
    userData,
    userCommunities,
    recommendedCommunities,
    activities,
    handleJoinCommunity
  } = useDashboardData();

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

  // If not logged in after checking, redirect handled in useDashboardData
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <UserHeader 
        name={userData.name}
        email={userData.email}
        avatar={userData.avatar}
      />
      
      <Tabs defaultValue="communities" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="communities">My Communities</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="settings">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="communities">
          <div className="grid grid-cols-1 gap-6">
            <UserCommunities userCommunities={userCommunities} />
            <RecommendedCommunities 
              communities={recommendedCommunities} 
              onJoin={handleJoinCommunity} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <UserActivities activities={activities} />
        </TabsContent>
        
        <TabsContent value="settings">
          <UserAccount 
            name={userData.name}
            email={userData.email}
            avatar={userData.avatar}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
