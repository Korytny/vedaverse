
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'; 
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Added profileAvatarUrl
type AuthContextType = {
  user: User | null;
  session: Session | null;
  profileAvatarUrl: string | null; 
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null); // State for profile avatar
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch avatar from public.profiles table
  const fetchProfileAvatar = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfileAvatarUrl(null); 
      return;
    }
    // console.log("Fetching profile avatar for user:", userId); // Debug log
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406: No row found (profile might not exist yet)
        console.error('Error fetching profile avatar:', error);
        setProfileAvatarUrl(null); 
      } else {
        // console.log("Fetched profile avatar data:", data); // Debug log
        setProfileAvatarUrl(data?.avatar_url || null); 
      }
    } catch (err) {
      console.error('Caught error fetching profile avatar:', err);
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
            // Fetch avatar from profiles immediately after getting user
            await fetchProfileAvatar(currentUser?.id); 
        }

      } catch (error) {
        console.error('Error in initial auth data fetch:', error);
         if (isMounted) {
             setSession(null);
             setUser(null);
             setProfileAvatarUrl(null);
         }
      } finally {
         // Set loading to false only after both session and initial avatar fetch attempt
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
       // Fetch avatar from profiles when auth state changes
       fetchProfileAvatar(newUser?.id); 
       setIsLoading(false); 
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileAvatar]); 

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfileAvatarUrl(null); // Clear profile avatar on sign out
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Simple refresh function
  const refreshUser = useCallback(async () => {
    // console.log("Refreshing user..."); // Debug log
    // setIsLoading(true); // Avoid flicker during background refresh
    try {
      // Fetch user and session
      const { data: { user: refreshedUser }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const { data: { session: refreshedSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      // Fetch profile avatar after getting user ID
      await fetchProfileAvatar(refreshedUser?.id);
      
      // Update state only if necessary to potentially reduce re-renders
      if (JSON.stringify(user) !== JSON.stringify(refreshedUser)) {
          setUser(refreshedUser);
      }
       if (JSON.stringify(session) !== JSON.stringify(refreshedSession)) {
          setSession(refreshedSession);
      }

    } catch (error) {
      console.error('Error refreshing user/session:', error);
      // Consider signing out if refresh fails (e.g., token expired)
      await signOut(); 
    } finally {
       // setIsLoading(false);
    }
  }, [user, session, fetchProfileAvatar]); // Include user and session to compare if needed

  // Provide profileAvatarUrl in the context value
  return (
    <AuthContext.Provider value={{ user, session, profileAvatarUrl, isLoading, signOut, refreshUser }}>
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
