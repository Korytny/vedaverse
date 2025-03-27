
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';

const Communities = () => {
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to the main page since the communities are now there
  useEffect(() => {
    navigate('/#communities');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition className="flex-grow pt-20">
        <main className="container px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Redirecting to Communities</h1>
            <p className="mb-6">The communities section has been moved to the home page.</p>
            <Button onClick={() => navigate('/#communities')}>
              Go to Communities
            </Button>
          </div>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Communities;
