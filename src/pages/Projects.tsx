
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to the main page since the projects are now there
  useEffect(() => {
    navigate('/#projects');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition className="flex-grow pt-20">
        <main className="container px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Redirecting to Projects</h1>
            <p className="mb-6">The projects section has been moved to the home page.</p>
            <Button onClick={() => navigate('/#projects')}>
              Go to Projects
            </Button>
          </div>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Projects;
