
import React from 'react';
// No navigate needed here unless you want to redirect after sign out
// import { useNavigate } from 'react-router-dom'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// import { GearIcon } from '@radix-ui/react-icons'; // Remove Settings icon
import { LogOut } from 'lucide-react'; // Import LogOut icon
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface UserHeaderProps {
  name: string;
  email: string;
  avatar: string;
}

const UserHeader = ({ name, email, avatar }: UserHeaderProps) => {
  // const navigate = useNavigate(); // Not needed for now
  const { signOut } = useAuth(); // Get signOut function
  const { t } = useTranslation(); // Get translation function
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-white shadow">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">{t('dashboard.header.welcome', { name })}</h1>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>
      {/* Replace Settings button with Sign Out button */}
      <Button variant="outline" className="gap-1" onClick={signOut}> {/* Call signOut on click */}
        <LogOut className="h-4 w-4" /> {/* Use LogOut icon */}
        {/* Use translation for logout button (from nav section) */}
        <span>{t('nav.logout')}</span> 
      </Button>
    </div>
  );
};

export default UserHeader;
