
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Community = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  members_count: number;
};

interface RecommendedCommunitiesProps {
  communities: Community[];
  onJoin: (communityId: string) => Promise<void>;
}

const RecommendedCommunities = ({ communities, onJoin }: RecommendedCommunitiesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended For You</CardTitle>
        <CardDescription>Based on your interests and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communities.map((community) => (
            <div key={community.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
              <h3 className="font-medium mb-1">{community.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                Connect with {community.members_count.toLocaleString()} members
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onJoin(community.id)}
              >
                Join Community
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedCommunities;
