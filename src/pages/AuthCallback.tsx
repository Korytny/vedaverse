
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Handling auth callback');
        
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        if (data.session) {
          console.log('Session found:', data.session.user.email);
          toast.success('Successfully signed in!');
          navigate('/dashboard');
        } else {
          console.log('No session found, checking for hash fragment');
          
          // Special handling for hash fragments that might contain auth info
          if (window.location.hash) {
            console.log('Hash fragment found:', window.location.hash);
            
            // Manually trigger session extraction from hash if needed
            const { data: hashData, error: hashError } = await supabase.auth.getUser();
            
            if (hashError) {
              console.error('Hash auth error:', hashError);
              throw hashError;
            }
            
            if (hashData.user) {
              console.log('User found from hash:', hashData.user.email);
              toast.success('Successfully signed in!');
              navigate('/dashboard');
              return;
            }
          }
          
          throw new Error('Authentication failed. No session found.');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center">
        {error ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
            <p>{error}</p>
            <p className="mt-4">Redirecting to homepage...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <svg className="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Completing Sign In...</h1>
            <p className="mt-2 text-muted-foreground">Please wait while we finish authenticating your account.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AuthCallback;
