
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTranslatedField } from '@/utils/getTranslatedField';
import { useTranslation } from 'react-i18next'; // Import useTranslation

type Community = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  members_count: number;
};

interface RecommendedCommunitiesProps {
  communities: Community[];
}

const RecommendedCommunities = ({ communities }: RecommendedCommunitiesProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation hook

  const handleNavigate = (communityId: string) => {
    navigate(`/project/${communityId}`); 
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.recommendedCommunities.title')}</CardTitle>
        <CardDescription>{t('dashboard.recommendedCommunities.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communities.map((community) => {
            const communityName = getTranslatedField(community.name, 'communityName');
            // const communityDescription = getTranslatedField(community.description, 'communityDesc');

            return (
              <div key={community.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                <h3 className="font-medium mb-1">{communityName}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {t('dashboard.recommendedCommunities.connectMembers', { count: community.members_count.toLocaleString() })} 
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleNavigate(community.id)}
                >
                  {t('dashboard.recommendedCommunities.viewCommunity')}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedCommunities;
