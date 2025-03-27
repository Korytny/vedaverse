
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // This is a placeholder for Google Auth
    // In a real implementation, we would connect to Supabase for auth
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button 
        onClick={handleLogin} 
        disabled={isLoading}
        className="rounded-full px-5 py-2 h-auto font-medium"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Connecting...</span>
          </div>
        ) : (
          <span>Sign In</span>
        )}
      </Button>
    </motion.div>
  );
};

export default LoginButton;
