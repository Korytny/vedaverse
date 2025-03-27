
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserAccountProps {
  name: string;
  email: string;
  avatar: string;
}

const UserAccount = ({ name, email, avatar }: UserAccountProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Manage your profile and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <Avatar className="h-20 w-20 border-2 border-white shadow">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">{name}</h3>
              <p className="text-muted-foreground">{email}</p>
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
  );
};

export default UserAccount;
