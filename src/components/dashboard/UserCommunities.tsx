
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { BookOpen, MessageSquare, Users } from 'lucide-react';

type UserCommunity = {
  id: string;
  community_id: string;
  user_id: string;
  joined_at: string;
  last_activity: string;
  unread_messages: number;
  community: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    members_count: number;
  };
};

interface UserCommunitiesProps {
  userCommunities: UserCommunity[];
}

const UserCommunities = ({ userCommunities }: UserCommunitiesProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default UserCommunities;
