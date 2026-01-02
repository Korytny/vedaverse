
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getTranslatedField } from '@/utils/getTranslatedField';

interface Community {
  id: string;
  name: string | object;
  short_description: string | object;
  image_url: string | null;
}

const Footer = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, short_description, image_url')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white border-t border-border/40">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Projects list */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Projects</h3>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : communities.length > 0 ? (
              <ul className="space-y-3">
                {communities.map((community) => (
                  <li key={community.id}>
                    <Link
                      to={`/project/${community.id}`}
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={community.image_url || './placeholder.svg'}
                          alt={getTranslatedField(community.name, 'Project')}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = './placeholder.svg')}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {getTranslatedField(community.name, 'Project')}
                        </div>
                        <div className="text-xs truncate">
                          {getTranslatedField(community.short_description, '')}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No projects yet</p>
            )}
          </div>

          {/* Right: Description */}
          <div>
            <h3 className="text-sm font-semibold mb-4">About</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              VedaVerse is a platform for collaborative learning and project management.
              Join communities, share knowledge, and work together on meaningful projects.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} VedaVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
