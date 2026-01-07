
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserHeader from '@/components/dashboard/UserHeader';
import UserProjects from '@/components/dashboard/UserProjects';
import RecommendedProjects from '@/components/dashboard/RecommendedProjects';
import UserActivities from '@/components/dashboard/UserActivities';
import AccountSettings from '@/components/dashboard/AccountSettings';
import { MyTasks } from '@/components/tasks/MyTasks';
import { OwnerAdmin } from '@/components/tasks/OwnerAdmin';
import { MyCommunities } from '@/components/dashboard/MyCommunities';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useTranslation } from 'react-i18next';

// Simple styles for tabs
const tabsContainerStyles: React.CSSProperties = {
  position: 'relative',
};

const getTabStyle = (isActive: boolean): React.CSSProperties => ({
  display: isActive ? 'block' : 'none',
});

const Dashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('communities');
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

  // Stabilize props to prevent unnecessary re-renders
  const stableUserCommunities = useMemo(() => userCommunities || [], [userCommunities]);
  const stableRecommendedCommunities = useMemo(() => recommendedCommunities || [], [recommendedCommunities]);
  const stableActivities = useMemo(() => activities || [], [activities]);

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
      
      <div className="w-full">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            type="button"
            variant={activeTab === 'communities' ? 'default' : 'outline'}
            onClick={() => setActiveTab('communities')}
          >
            {t('dashboard.tabs.myCommunities')}
          </Button>
          <Button
            type="button"
            variant={activeTab === 'my-communities' ? 'default' : 'outline'}
            onClick={() => setActiveTab('my-communities')}
          >
            My Communities
          </Button>
          <Button
            type="button"
            variant={activeTab === 'my-tasks' ? 'default' : 'outline'}
            onClick={() => setActiveTab('my-tasks')}
          >
            My Tasks
          </Button>
          <Button
            type="button"
            variant={activeTab === 'owner-admin' ? 'default' : 'outline'}
            onClick={() => setActiveTab('owner-admin')}
          >
            Owner Admin
          </Button>
          <Button
            type="button"
            variant={activeTab === 'activity' ? 'default' : 'outline'}
            onClick={() => setActiveTab('activity')}
          >
            {t('dashboard.tabs.recentActivity')}
          </Button>
          <Button
            type="button"
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('settings')}
          >
            {t('dashboard.tabs.account')}
          </Button>
        </div>

        <div style={tabsContainerStyles}>
          <div style={getTabStyle(activeTab === 'communities')}>
            <div className="grid grid-cols-1 gap-6">
              <UserProjects userCommunities={stableUserCommunities} />
              {(stableRecommendedCommunities.length > 0) && (
                <RecommendedProjects
                  communities={stableRecommendedCommunities}
                  onJoin={handleJoinCommunity}
                />
              )}
            </div>
          </div>

          <div style={getTabStyle(activeTab === 'my-communities')}>
            <MyCommunities />
          </div>

          <div style={getTabStyle(activeTab === 'activity')}>
            <UserActivities activities={stableActivities} />
          </div>

          <div style={getTabStyle(activeTab === 'settings')}>
            <AccountSettings />
          </div>

          <div style={getTabStyle(activeTab === 'my-tasks')}>
            <MyTasks />
          </div>

          <div style={getTabStyle(activeTab === 'owner-admin')}>
            <OwnerAdmin />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
