
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserHeader from '@/components/dashboard/UserHeader';
import UserProjects from '@/components/dashboard/UserProjects';
import RecommendedProjects from '@/components/dashboard/RecommendedProjects';
import UserActivities from '@/components/dashboard/UserActivities';
// import UserAccount from '@/components/dashboard/UserAccount'; // Remove import
import AccountSettings from '@/components/dashboard/AccountSettings'; // Import the new component
import { useDashboardData } from '@/hooks/useDashboardData';
import { useTranslation } from 'react-i18next'; 

const Dashboard = () => {
  const { t } = useTranslation(); 
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
          <h1 className="text-2xl font-bold">{t('dashboard.loading')}</h1> 
          <p className="mt-2 text-muted-foreground">{t('dashboard.loadingDesc')}</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) { // Added check for userData as well
    // Potentially show a message or redirect, although useDashboardData might handle it
    console.warn("Dashboard: User or userData not available.", { user, userData })
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Unable to load dashboard</h1>
          <p className="mt-2">Please try refreshing the page or contact support.</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded">
            Reload Page
          </button>
        </div>
      </div>
    );
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
          <TabsTrigger value="communities">{t('dashboard.tabs.myCommunities')}</TabsTrigger>
          <TabsTrigger value="activity">{t('dashboard.tabs.recentActivity')}</TabsTrigger>
          <TabsTrigger value="settings">{t('dashboard.tabs.account')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="communities">
          <div className="grid grid-cols-1 gap-6">
            <UserProjects userCommunities={userCommunities || []} />
            {(recommendedCommunities && recommendedCommunities.length > 0) && (
              <RecommendedProjects
                communities={recommendedCommunities}
                onJoin={handleJoinCommunity}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <UserActivities activities={activities} />
        </TabsContent>
        
        <TabsContent value="settings">
          {/* Replace UserAccount with AccountSettings */}
          <AccountSettings /> 
          {/* Removed props as AccountSettings fetches its own data using useAuth */}
          {/* <UserAccount 
            name={userData.name}
            email={userData.email}
            avatar={userData.avatar}
          /> */}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
