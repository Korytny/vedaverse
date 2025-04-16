import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AvatarStackProps {
  avatars: { avatar_url: string | null }[]; // Array of objects with avatar_url
  maxAvatars?: number; // Optional: Max avatars to show before showing count
}

const AvatarStack: React.FC<AvatarStackProps> = ({ avatars = [], maxAvatars = 5 }) => {
  if (!avatars || avatars.length === 0) {
    return null; // Don't render anything if no avatars
  }

  const visibleAvatars = avatars.slice(0, maxAvatars);
  const remainingCount = avatars.length - visibleAvatars.length;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center -space-x-2"> {/* Negative space for overlap */}
        {visibleAvatars.map((avatarData, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-background cursor-default"> {/* Smaller avatars */}
                <AvatarImage src={avatarData?.avatar_url ?? undefined} alt={`Member ${index + 1}`} />
                <AvatarFallback className="text-xs">?</AvatarFallback> {/* Smaller fallback */}
              </Avatar>
            </TooltipTrigger>
            {/* Optional: Add TooltipContent to show user name if available later */}
             {/* <TooltipContent>User Name</TooltipContent> */}
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-background cursor-default">
                 {/* Fallback showing the count of remaining members */}
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
