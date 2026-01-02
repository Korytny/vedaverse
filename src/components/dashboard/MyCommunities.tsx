import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Community {
  id: string;
  name: string | object;
  owners_id: string | string[] | null;
  members_count: number;
  image_url: string | null;
}

export function MyCommunities() {
  const { profileId } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCommunities();
  }, [profileId]);

  const loadMyCommunities = async () => {
    if (!profileId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, owners_id, members_count, image_url')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter communities where user is an owner
      // User is owner only if they are the FIRST in the array
      const ownedCommunities = (data || []).filter((community: Community) => {
        let owners: string[] = [];

        if (Array.isArray(community.owners_id)) {
          owners = community.owners_id;
        } else if (typeof community.owners_id === 'string') {
          try {
            owners = JSON.parse(community.owners_id);
          } catch (e) {
            console.warn('Failed to parse owners_id:', community.owners_id);
          }
        }

        return owners.length > 0 && owners[0] === profileId;
      });

      setCommunities(ownedCommunities);
    } catch (error: any) {
      console.error('Error loading my communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (name: string | object): string => {
    if (typeof name === 'string') {
      try {
        const parsed = JSON.parse(name);
        return parsed.ru || parsed.en || Object.values(parsed)[0] || 'Community';
      } catch {
        return name;
      }
    }
    if (typeof name === 'object' && name !== null) {
      return (name as any).ru || (name as any).en || Object.values(name)[0] || 'Community';
    }
    return 'Community';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            You are not an owner of any communities yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="h-5 w-5 text-yellow-500" />
        <h2 className="text-2xl font-bold">My Communities</h2>
        <Badge variant="secondary">{communities.length}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communities.map((community) => (
          <Card key={community.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={community.image_url || './placeholder.svg'}
                    alt={getDisplayName(community.name)}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = './placeholder.svg')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{getDisplayName(community.name)}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Owner
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {community.members_count || 0}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`/project/${community.id}`}>View</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to={`/dashboard?tab=owner-admin`}>Manage Tasks</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
