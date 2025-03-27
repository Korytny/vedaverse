
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GearIcon } from '@radix-ui/react-icons';

interface UserHeaderProps {
  name: string;
  email: string;
  avatar: string;
}

const UserHeader = ({ name, email, avatar }: UserHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-white shadow">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Welcome, {name}</h1>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>
      <Button variant="outline" className="gap-1" onClick={() => navigate('/profile')}>
        <GearIcon className="h-4 w-4" />
        <span>Settings</span>
      </Button>
    </div>
  );
};

export default UserHeader;
