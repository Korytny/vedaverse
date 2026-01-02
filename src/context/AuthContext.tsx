
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'; 
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Added profileAvatarUrl and profileId
type AuthContextType = {
  user: User | null;
  session: Session | null;
  profileId: string | null;
  profileAvatarUrl: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch profile ID and avatar from public.profiles table using user_id
  const fetchProfileData = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfileId(null);
      setProfileAvatarUrl(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile data:', error);
        setProfileId(null);
        setProfileAvatarUrl(null);
      } else {
        setProfileId(data?.id || null);
        setProfileAvatarUrl(data?.avatar_url || null);
      }
    } catch (err) {
      console.error('Caught error fetching profile data:', err);
      setProfileId(null);
      setProfileAvatarUrl(null);
    }
  }, []);

  // Effect to get session and listen for auth changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const getInitialData = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (isMounted) {
            const currentUser = currentSession?.user || null;
            setSession(currentSession);
            setUser(currentUser);
            // Fetch profile ID and avatar from profiles using user_id
            await fetchProfileData(currentUser?.id);
        }

      } catch (error) {
        console.error('Error in initial auth data fetch:', error);
         if (isMounted) {
             setSession(null);
             setUser(null);
             setProfileId(null);
             setProfileAvatarUrl(null);
         }
      } finally {
         if (isMounted) setIsLoading(false);
      }
    };

    getInitialData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
       if (!isMounted) return;
       console.log("Auth state change detected:", _event, newSession);
       const newUser = newSession?.user || null;
       setSession(newSession);
       setUser(newUser);
       // Fetch profile data when auth state changes
       fetchProfileData(newUser?.id);
       setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileData]); 

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfileId(null);
      setProfileAvatarUrl(null);
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Simple refresh function
  const refreshUser = useCallback(async () => {
    try {
      const { data: { user: refreshedUser }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const { data: { session: refreshedSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      // Fetch profile data after getting user id
      await fetchProfileData(refreshedUser?.id);

      if (JSON.stringify(user) !== JSON.stringify(refreshedUser)) {
          setUser(refreshedUser);
      }
       if (JSON.stringify(session) !== JSON.stringify(refreshedSession)) {
          setSession(refreshedSession);
      }

    } catch (error) {
      console.error('Error refreshing user/session:', error);
      await signOut();
    }
  }, [user, session, fetchProfileData, signOut]);

  // Provide profileId and profileAvatarUrl in the context value
  return (
    <AuthContext.Provider value={{ user, session, profileId, profileAvatarUrl, isLoading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
