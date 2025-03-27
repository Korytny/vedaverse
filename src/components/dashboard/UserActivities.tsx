
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

type Activity = {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
};

interface UserActivitiesProps {
  activities: Activity[];
}

const UserActivities = ({ activities }: UserActivitiesProps) => {
  return (
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
  );
};

export default UserActivities;
