import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AvatarStackProps {
  avatars: { avatar_url: string | null; user_id?: string; full_name?: string | null }[];
  maxAvatars?: number;
}

const AvatarStack: React.FC<AvatarStackProps> = ({ avatars = [], maxAvatars = 5 }) => {
  if (!avatars || avatars.length === 0) {
    return null;
  }

  const visibleAvatars = avatars.slice(0, maxAvatars);
  const remainingCount = avatars.length - visibleAvatars.length;

  const getInitials = (userId: string | undefined, fullName: string | null | undefined, index: number) => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (userId) {
      return userId.slice(0, 2).toUpperCase();
    }
    return `U${index + 1}`;
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center -space-x-2">
        {visibleAvatars.map((avatarData, index) => (
          <Tooltip key={avatarData?.user_id || index}>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-background cursor-default">
                <AvatarImage src={avatarData?.avatar_url ?? undefined} alt={avatarData?.full_name || `Member ${index + 1}`} />
                <AvatarFallback className="text-xs bg-primary/10">
                  {getInitials(avatarData?.user_id, avatarData?.full_name, index)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              {avatarData?.full_name || `Member ${index + 1}`}
            </TooltipContent>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-background cursor-default">
                <AvatarFallback className="text-xs bg-muted">+{remainingCount}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              +{remainingCount} more members
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AvatarStack;
